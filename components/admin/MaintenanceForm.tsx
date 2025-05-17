"use client"


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createMaintenance, getVehicles } from "@/lib/actions/vehicle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { maintenanceSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";

interface Props extends Partial<Maintenance> {
    id?: string;
    vehicleId: string;
    date: Date;
    notes: string;
    status: boolean;

}

const MaintenanceForm = ({ }: Props) => {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehicleData = await getVehicles();
                setVehicles(vehicleData);
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
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
    })

    const onSubmit = async (values: z.infer<typeof maintenanceSchema>) => {
        console.log("Submitting:", values);

        const result = await createMaintenance(values);

        if (result.success) {
            router.push("/managements");
        } else {
            console.log("Create error:", result.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Vehicle" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading">Loading vehicles...</SelectItem>
                                    ) : vehicles.length > 0 ? (
                                        vehicles
                                            .filter(vehicle => vehicle.status === "available")
                                            .map(vehicle => (
                                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.model} - {vehicle.regNumber}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="none">No vehicles available</SelectItem>
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
                            <FormLabel>Schedule Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="Schedule Date"
                                    value={
                                        field.value
                                    }
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
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
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className=" text-white">
                    Add Maintenance
                </Button>
            </form>
        </Form>
    )
}

export default MaintenanceForm;