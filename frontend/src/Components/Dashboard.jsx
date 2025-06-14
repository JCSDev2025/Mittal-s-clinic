import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [dailySale, setDailySale] = useState(0);
    const [branchTarget, setBranchTarget] = useState(0); 
    const [staffPerformance, setStaffPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allStaffList, setAllStaffList] = useState([]);

    const inrFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getStaffSummaryForDashboard = (allTargets, allBills, staffListData) => {
        if (!staffListData.length) return [];

        const staffSummaryMap = {};

        staffListData.forEach(staff => {
            staffSummaryMap[staff._id] = {
                name: capitalizeFirstLetter(staff.name),
                target: 0,
                achieved: 0,
                remaining: 0,
                role: staff.role,
            };
        });

        allTargets.forEach(target => {
            if (target.staffId && staffSummaryMap[target.staffId._id]) {
                staffSummaryMap[target.staffId._id].target += target.targetAmount;
            }
        });

        allBills.forEach(bill => {
            const staff = staffListData.find(s => s.name === bill.assignedStaff);
            if (staff && staffSummaryMap[staff._id]) {
                staffSummaryMap[staff._id].achieved += (bill.amountPaid || 0);
            }
        });

        return Object.values(staffSummaryMap).map(staff => ({
            ...staff,
            remaining: staff.target - staff.achieved,
        }));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [billsRes, targetsRes, staffRes, branchTargetsRes] = await Promise.all([
                axios.get('/api/bills'),
                axios.get('/api/targets/staff'),
                axios.get('/api/staff'),
                axios.get('/api/branchtargets'),
            ]);

            const billsData = billsRes.data;
            const targetsData = targetsRes.data;
            const staffListData = staffRes.data;
            const branchTargetsData = branchTargetsRes.data;

            setAllStaffList(staffListData);

            const calculatedTotalSales = billsData.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0);
            setTotalSales(calculatedTotalSales);

            const calculatedPendingAmount = billsData.reduce((sum, bill) => sum + ((bill.totalAmount || 0) - (bill.amountPaid || 0)), 0);
            setPendingAmount(calculatedPendingAmount);

            const today = dayjs();
            const calculatedDailySale = billsData.reduce((sum, bill) => {
                const billDate = dayjs(bill.createdAt);
                if (billDate.isSame(today, 'day')) {
                    return sum + (bill.amountPaid || 0);
                }
                return sum;
            }, 0);
            setDailySale(calculatedDailySale);

            if (branchTargetsData && branchTargetsData.length > 0) {
                setBranchTarget(branchTargetsData[0].amount); 
            } else {
                setBranchTarget(0);
            }

            const staffSummary = getStaffSummaryForDashboard(targetsData, billsData, staffListData);
            setStaffPerformance(staffSummary);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
            toast.error('Failed to fetch dashboard data.', { position: 'top-right' });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBranchTargetClick = () => {
        window.location.assign('/branchtargets'); 
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600 animate-pulse">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">Clinic Overview</h1>
            <p className="text-lg text-gray-600 mb-10">A quick glance at your clinic's performance today.</p>

            {/* --- */}
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <DashboardCard
                    icon={<div className="text-4xl">🎯</div>}
                    label="Branch Target"
                    value={inrFormatter.format(branchTarget)}
                    bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                    textColor="text-white"
                    onClick={handleBranchTargetClick}
                    isClickable={true} 
                />

                <DashboardCard
                    icon={<div className="text-4xl">💰</div>}
                    label="Total Sale"
                    value={inrFormatter.format(totalSales)}
                    bgColor="bg-gradient-to-br from-green-500 to-green-600"
                    textColor="text-white"
                />
                <DashboardCard
                    icon={<div className="text-4xl">📈</div>}
                    label="Daily Sale"
                    value={inrFormatter.format(dailySale)}
                    bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
                    textColor="text-white"
                />
                <DashboardCard
                    icon={<div className="text-4xl">⏳</div>}
                    label="Pending Amount"
                    value={inrFormatter.format(pendingAmount)}
                    bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
                    textColor="text-white"
                />
            </div>

            {/* --- */}
            {/* Staff Performance */}
            <section className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Staff Performance Overview</h2>
                {staffPerformance.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staffPerformance.map((staff, index) => (
                            <StaffPerformanceCard
                                key={staff.name || index}
                                staff={staff}
                                inrFormatter={inrFormatter}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg py-10">No staff performance data available for the current period.</p>
                )}
            </section>
        </div>
    );
};

const DashboardCard = ({ icon, label, value, bgColor, textColor, onClick, isClickable }) => (
    <div
        className={`rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center space-y-3 
        ${bgColor} ${textColor} 
        transform transition-transform duration-300 hover:scale-105 hover:shadow-xl
        ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={isClickable ? onClick : undefined}
    >
        <div className="flex-shrink-0 mb-2">{icon}</div>
        <div className="flex-grow">
            <div className="text-sm opacity-90 font-medium mb-1">{label}</div>
            <div className="text-3xl font-extrabold">{value}</div>
        </div>
    </div>
);

const StaffPerformanceCard = ({ staff, inrFormatter }) => {
    const percentageAchieved = staff.target > 0 ? (staff.achieved / staff.target) * 100 : 0;
    
    let progressBarColor;
    let performanceStatus;
    let borderColor;

    if (percentageAchieved >= 100) {
        progressBarColor = 'bg-green-500';
        performanceStatus = 'On Target';
        borderColor = 'border-green-400';
    } else if (percentageAchieved >= 75) {
        progressBarColor = 'bg-yellow-500';
        performanceStatus = 'Nearing Target';
        borderColor = 'border-yellow-400';
    } else if (percentageAchieved > 0) {
        progressBarColor = 'bg-red-500';
        performanceStatus = 'Below Target';
        borderColor = 'border-red-400';
    } else {
        progressBarColor = 'bg-gray-400'; 
        performanceStatus = 'No Progress Yet';
        borderColor = 'border-gray-300';
    }

    return (
        <div className={`bg-white rounded-xl shadow-lg p-5 border-t-4 ${borderColor} flex flex-col justify-between transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl`}>
            <div>
                <h4 className="text-xl font-bold text-gray-800 mb-1">{staff.name} <span className="text-gray-500 text-sm font-medium">({staff.role})</span></h4>
                <p className={`text-sm font-semibold mb-3 ${percentageAchieved >= 100 ? 'text-green-600' : percentageAchieved >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                    Status: {performanceStatus}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-gray-700">Target:</span> {inrFormatter.format(staff.target)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-gray-700">Achieved:</span> {inrFormatter.format(staff.achieved)}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold text-gray-700">Remaining:</span> {inrFormatter.format(staff.remaining)}
                </p>
            </div>
            {staff.target > 0 ? (
                // Adjusted progress bar for better percentage visibility
                <div className="w-full bg-gray-200 rounded-full h-4 mt-3 relative overflow-hidden">
                    <div
                        className={`${progressBarColor} h-full rounded-full flex items-center px-2 text-xs font-bold text-black transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(percentageAchieved, 100)}%` }}
                        title={`${percentageAchieved.toFixed(1)}% achieved`}
                    >
                        {/* Conditionally render percentage only if there's enough space */}
                        {percentageAchieved > 5 && <span className="absolute right-2">{percentageAchieved.toFixed(0)}%</span>}
                        {percentageAchieved <= 5 && <span className="absolute left-1 text-gray-900">{percentageAchieved.toFixed(0)}%</span>}
                    </div>
                </div>
            ) : (
                <p className="text-xs text-gray-500 italic mt-3 p-1 bg-gray-50 rounded">No target set for this period.</p>
            )}
        </div>
    );
};

export default Dashboard;