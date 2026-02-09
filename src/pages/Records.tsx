import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, FileText, Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Records = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("registry");

    const { data: registryData, isLoading: isRegistryLoading, refetch: refetchRegistry } = useQuery({
        queryKey: ['registry'],
        queryFn: api.getRegistry
    });

    const { data: hospitalData, isLoading: isHospitalLoading, refetch: refetchHospital } = useQuery({
        queryKey: ['hospitalRecords'],
        queryFn: api.getHospitalRecords
    });

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-gradient">Medical Records</h1>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                    refetchRegistry();
                    refetchHospital();
                }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <Tabs defaultValue="registry" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="registry" className="gap-2">
                        <Activity className="h-4 w-4" /> Patient Registry
                    </TabsTrigger>
                    <TabsTrigger value="hospital" className="gap-2">
                        <FileText className="h-4 w-4" /> Hospital Records
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="registry" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Registry</CardTitle>
                            <CardDescription>
                                Comprehensive log of all patient diagnostics and risk assessments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isRegistryLoading ? (
                                <div className="flex justify-center p-8">Loading records...</div>
                            ) : registryData && registryData.length > 0 ? (
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Timestamp</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Age</TableHead>
                                                <TableHead>Gender</TableHead>
                                                <TableHead>Diagnosis</TableHead>
                                                <TableHead>Confidence</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registryData.slice().reverse().map((row: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>{row.Timestamp}</TableCell>
                                                    <TableCell className="font-medium">{row['Patient Name'] || row.Name}</TableCell>
                                                    <TableCell>{row.Age}</TableCell>
                                                    <TableCell>{row.GenderStr || (row.Gender === 1 ? 'Male' : 'Female')}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.Diagnosis === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                row.Diagnosis === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {row.Diagnosis}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{row['Confidence Score']}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No registry records found.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hospital" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hospital Transaction Records</CardTitle>
                            <CardDescription>
                                Official records of booked appointments and transactions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isHospitalLoading ? (
                                <div className="flex justify-center p-8">Loading records...</div>
                            ) : hospitalData && hospitalData.length > 0 ? (
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Transaction ID</TableHead>
                                                <TableHead>Patient</TableHead>
                                                <TableHead>Doctor</TableHead>
                                                <TableHead>Specialty</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {hospitalData.slice().reverse().map((row: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>{row['Appt Date']} {row['Appt Time']}</TableCell>
                                                    <TableCell className="font-mono text-xs">{row['Transaction ID']}</TableCell>
                                                    <TableCell className="font-medium">{row['Patient Name']}</TableCell>
                                                    <TableCell>{row['Doctor Name']}</TableCell>
                                                    <TableCell>{row.Specialty}</TableCell>
                                                    <TableCell>{row['Fee Paid']}</TableCell>
                                                    <TableCell>
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            {row['Payment Status']}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No hospital records found.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Records;
