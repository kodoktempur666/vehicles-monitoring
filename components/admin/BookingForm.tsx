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
import { createBooking, getDestinations, getDrivers, getUsers, getVehicles } from "@/lib/actions/booking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { bookingSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";

interface Props extends Partial<Booking> {
    id?: string;
    vehicleId: string;
    date: Date;
    notes: string;
    status: string;
    driverId: string;
    destinationId: string;
    distance: number;
    approver1Id: string;
    approver2Id: string;
    createdAt: Date;
}

const BookingForm = ({ }: Props) => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [driverData, destinationData, userData, vehicleData] = await Promise.all([
                    getDrivers(),
                    getDestinations(),
                    getUsers(),
                    getVehicles()
                ]);
                
                setDrivers(driverData);
                setDestinations(destinationData);
                setUsers(userData);
                setVehicles(vehicleData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const form = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            startDate: new Date(),
            endDate: new Date(),
            approver1Id: "",
            approver2Id: "",
            vehicleId: "",
            driverId: "",
            destinationId: "",
            notes: "",
            status: "pending",
            distance: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
        console.log("Form values:", values);
        if (isSubmitting) return; 
        
        setIsSubmitting(true);
        console.log("Submitting:", values);

        try {
            const result = await createBooking(values);
            console.log("Result:", result);

            if (result.success) {
                router.push("/bookings");
            } else {
                console.error("Create error:", result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    function formatDateToInput(date: Date | string | null | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    // Add form validation check
    const isFormValid = form.formState.isValid;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a vehicle" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading" disabled>Loading vehicles...</SelectItem>
                                    ) : vehicles.length > 0 ? (
                                        vehicles
                                            .filter(vehicle => vehicle.status === "available")
                                            .map(vehicle => (
                                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.model} - {vehicle.regNumber}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="none" disabled>No vehicles available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="approver1Id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Approver 1</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an approver" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading" disabled>Loading approvers...</SelectItem>
                                    ) : users.length > 0 ? (
                                        users
                                            .filter(user => user.role === "approver_l1")
                                            .map(user => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="none" disabled>No approvers available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="approver2Id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Approver 2</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an approver" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading" disabled>Loading approvers...</SelectItem>
                                    ) : users.length > 0 ? (
                                        users
                                            .filter(user => user.role === "approver_l2")
                                            .map(user => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="none" disabled>No approvers available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="driverId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a driver" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading" disabled>Loading drivers...</SelectItem>
                                    ) : drivers.length > 0 ? (
                                        drivers
                                            .filter(driver => driver.status === "available")
                                            .map(driver => (
                                                <SelectItem key={driver.id} value={driver.id}>
                                                    {driver.name}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="none" disabled>No drivers available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="destinationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a destination" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoading ? (
                                        <SelectItem value="loading" disabled>Loading destinations...</SelectItem>
                                    ) : destinations.length > 0 ? (
                                        destinations.map(destination => (
                                            <SelectItem key={destination.id} value={destination.id}>
                                                {destination.name} - {destination.type}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>No destinations available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="Start Date"
                                    value={formatDateToInput(field.value)}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="End Date"
                                    value={formatDateToInput(field.value)}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Distance (km)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Distance in kilometers"
                                    type="number"
                                    min="0"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                                <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    className="w-full text-white" 
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? "Creating Booking..." : "Add Booking"}
                </Button>
            </form>
        </Form>
    );
};

export default BookingForm;