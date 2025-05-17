"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { createVehicle } from "@/lib/actions/vehicle";
import { vehicleSchema } from "@/lib/validation";

// Enhanced interface with better typing
interface VehicleFormProps {
    id?: string;
    initialData?: {
        model?: string;
        regNumber?: string;
        type?: "passenger" | "cargo";
        fuelConsumption?: number;
        status?: "available" | "in-use" | "maintenance";
    };
    onSuccess?: (vehicleId: string) => void;
    onError?: (error: string) => void;
}

const VEHICLE_TYPES = [
    { value: "passenger", label: "Passenger" },
    { value: "cargo", label: "Cargo" },
] as const;

const VEHICLE_STATUS = [
    { value: "available", label: "Available" },
    { value: "in-use", label: "In Use" },
    { value: "maintenance", label: "Maintenance" },
] as const;

const VehicleForm = ({ 
    id, 
    initialData, 
    onSuccess, 
    onError 
}: VehicleFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof vehicleSchema>>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            model: initialData?.model || "",
            regNumber: initialData?.regNumber || "",
            type: initialData?.type || "cargo",
            fuelConsumption: initialData?.fuelConsumption || 0,
            status: initialData?.status || "available",
        },
    });

    const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
        try {
            setIsSubmitting(true);
            const result = await createVehicle(values);

            if (result.success) {
                form.reset();
                onSuccess?.(result.data?.id);
                router.push("/managements");
            } else {
                const errorMessage = result.message || "Failed to create vehicle";
                onError?.(errorMessage);
                console.error("Vehicle creation failed:", errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "An unexpected error occurred";
            onError?.(errorMessage);
            console.error("Unexpected error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    {id ? "Edit Vehicle" : "Add New Vehicle"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {id ? "Update vehicle information" : "Enter vehicle details below"}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle Model</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="e.g., Toyota Hilux" 
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="regNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registration Number</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="e.g., B 1234 ABC" 
                                        {...field}
                                        disabled={isSubmitting}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle Type</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {VEHICLE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fuelConsumption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Consumption (L/100km)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., 8.5"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="1000"
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? 0 : Number(value));
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <div className="flex gap-3 pt-4">
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
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting 
                                ? (id ? "Updating..." : "Adding...") 
                                : (id ? "Update Vehicle" : "Add Vehicle")
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default VehicleForm;