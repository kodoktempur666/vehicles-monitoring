"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wrench } from "lucide-react";

import { createMaintenance, getVehicles } from "@/lib/actions/vehicle";
import { maintenanceSchema } from "@/lib/validation";

interface Props extends Partial<Maintenance> {
    id?: string;
    vehicleId?: string;
    date?: Date;
    notes?: string;
    status?: boolean;
}

const MaintenanceForm = ({ }: Props) => {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const vehicleData = await getVehicles();
                setVehicles(vehicleData || []);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
                setError("Failed to load vehicles. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const form = useForm<z.infer<typeof maintenanceSchema>>({
        resolver: zodResolver(maintenanceSchema),
        defaultValues: {
            scheduledDate: new Date(),
            vehicleId: "",
            notes: "",
            status: true,
        },
    });

    const onSubmit = async (values: z.infer<typeof maintenanceSchema>) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        
        try {
            console.log("Submitting maintenance data:", values);
            
            // Manual validation check
            const validation = maintenanceSchema.safeParse(values);
            if (!validation.success) {
                console.error("Validation errors:", validation.error.flatten());
                setError("Please fill in all required fields correctly.");
                return;
            }

            const result = await createMaintenance(values);

            if (result?.success) {
                console.log("Maintenance created successfully");
                router.push("/managements");
            } else {
                const errorMessage = result?.message || "Failed to create maintenance record";
                console.error("Create error:", errorMessage);
                setError(errorMessage);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date for input field
    const formatDateToInput = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    // Get available vehicles for display
    const availableVehicles = vehicles.filter(vehicle => vehicle.status === "available");

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Schedule Maintenance</CardTitle>
                    <CardDescription>
                        Create a new maintenance record for your vehicle fleet
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="vehicleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Vehicle</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                            disabled={isLoading || isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select a vehicle for maintenance" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isLoading ? (
                                                    <SelectItem value="loading" disabled>
                                                        <div className="flex items-center">
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Loading vehicles...
                                                        </div>
                                                    </SelectItem>
                                                ) : availableVehicles.length > 0 ? (
                                                    availableVehicles.map(vehicle => (
                                                        <SelectItem key={vehicle.id} value={vehicle.id}>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">
                                                                    {vehicle.model}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {vehicle.regNumber}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        No vehicles available for maintenance
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scheduledDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Scheduled Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="h-11"
                                                value={formatDateToInput(field.value)}
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                                disabled={isSubmitting}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Notes</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Enter maintenance notes, issues to address, or special instructions..."
                                                className="min-h-[100px] resize-none"
                                                disabled={isSubmitting}
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting || isLoading || !form.formState.isValid}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Wrench className="mr-2 h-4 w-4" />
                                            Schedule Maintenance
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* Debug Panel - Development Only */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                            <details className="cursor-pointer">
                                <summary className="font-medium text-sm text-gray-700 mb-2">
                                    Debug Information
                                </summary>
                                <div className="text-xs space-y-1 text-gray-600">
                                    <p>Form Valid: {form.formState.isValid ? '✅' : '❌'}</p>
                                    <p>Is Submitting: {isSubmitting ? '⏳' : '✅'}</p>
                                    <p>Is Loading: {isLoading ? '⏳' : '✅'}</p>
                                    <p>Vehicles Count: {vehicles.length}</p>
                                    <p>Available Vehicles: {availableVehicles.length}</p>
                                    {Object.keys(form.formState.errors).length > 0 && (
                                        <div>
                                            <p className="font-medium">Errors:</p>
                                            <pre className="text-xs bg-red-50 p-2 rounded border">
                                                {JSON.stringify(form.formState.errors, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MaintenanceForm;