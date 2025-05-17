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
import { createVehicle } from "@/lib/actions/vehicle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { vehicleSchema } from "@/lib/validation";

interface Props extends Partial<Vehicle> {
    id?: string;
    model: string;
    regNumber: string;
    type: string;
    fuelConsumption: number;
    status: string;
}

const VehicleForm = ({  }: Props) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof vehicleSchema>>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            model: "",
            regNumber: "",
            type: "cargo",
            fuelConsumption: 0,
            status: "available",
        },
    })

    const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
        const result = await createVehicle(values);

        if (result.success) {
            router.push("/managements");
        } else {
            console.log(result.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                                <Input placeholder="Model" {...field} />
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
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                                <Input placeholder="Registration Number" {...field} />
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
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="passenger">Passenger</SelectItem>
                                    <SelectItem value="cargo">Cargo</SelectItem>
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
                            <FormLabel>Fuel Consumption</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Fuel Consumption"
                                    type="number"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className=" text-white">
                    Add Vehicle
                </Button>
            </form>
        </Form>
    )
}

export default VehicleForm;