import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SellIcon from '@mui/icons-material/Sell';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DownloadIcon from '@mui/icons-material/Download';

// Recharts imports
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// For PDF generation
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- Dummy Data Simulation (replace with actual API calls in a real app) ---
// In a real application, this data would come from Firestore or your backend.

const dummyEvents = [
    {
        id: 'evt-001',
        name: 'Tech Innovators Summit 2025',
        organizerId: 'organizer-1',
        startDate: '2025-09-10T09:00:00Z',
        endDate: '2025-09-12T17:00:00Z',
        location: 'Convention Center',
        ticketsSold: 1250,
        totalTickets: 2000,
        revenue: 75000, // Total revenue for this event
        ticketTypes: {
            'Standard Pass': { price: 50, sold: 900 },
            'VIP Pass': { price: 150, sold: 200 },
            'Student Discount': { price: 25, sold: 150 }
        }
    },
    {
        id: 'evt-002',
        name: 'Annual Charity Gala',
        organizerId: 'organizer-1',
        startDate: '2025-10-22T18:00:00Z',
        endDate: '2025-10-22T23:00:00Z',
        location: 'Grand Ballroom',
        ticketsSold: 800,
        totalTickets: 800,
        revenue: 120000,
        ticketTypes: {
            'General Admission': { price: 100, sold: 600 },
            'Premium Seat': { price: 250, sold: 200 }
        }
    },
    {
        id: 'evt-003',
        name: 'Local Food Festival',
        organizerId: 'organizer-1',
        startDate: '2025-06-15T10:00:00Z', // Ended in the past
        endDate: '2025-06-16T18:00:00Z',
        location: 'City Park',
        ticketsSold: 3000,
        totalTickets: 3000,
        revenue: 45000,
        ticketTypes: {
            'Daily Pass': { price: 15, sold: 2500 },
            'Weekend Pass': { price: 25, sold: 500 }
        }
    },
    {
        id: 'evt-004',
        name: 'Winter Wonderland Market',
        organizerId: 'organizer-1',
        startDate: '2025-12-05T10:00:00Z',
        endDate: '2025-12-07T20:00:00Z',
        location: 'Winter Fairgrounds',
        ticketsSold: 150,
        totalTickets: 1000,
        revenue: 7500,
        ticketTypes: {
            'Entry Ticket': { price: 10, sold: 150 }
        }
    },
];

const dummyScanRecords = [
    // Event 1 scans
    { id: 'sc-001', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T09:05:00Z', ticketId: 'T001', status: 'valid', ticketType: 'Standard Pass' },
    { id: 'sc-002', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T09:06:00Z', ticketId: 'T002', status: 'valid', ticketType: 'Standard Pass' },
    { id: 'sc-003', eventId: 'evt-001', scannedByStaffId: 'staff-3', timestamp: '2025-09-10T09:07:00Z', ticketId: 'T003', status: 'valid', ticketType: 'VIP Pass' },
    { id: 'sc-004', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T09:08:00Z', ticketId: 'T004', status: 'duplicate', ticketType: 'Standard Pass' },
    { id: 'sc-005', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-10T10:00:00Z', ticketId: 'T005', status: 'valid', ticketType: 'Standard Pass' },
    { id: 'sc-006', eventId: 'evt-001', scannedByStaffId: 'staff-3', timestamp: '2025-09-10T10:01:00Z', ticketId: 'T006', status: 'valid', ticketType: 'Student Discount' },
    { id: 'sc-007', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-11T09:30:00Z', ticketId: 'T007', status: 'valid', ticketType: 'Standard Pass' },
    { id: 'sc-008', eventId: 'evt-001', scannedByStaffId: 'staff-3', timestamp: '2025-09-11T09:35:00Z', ticketId: 'T008', status: 'expired', ticketType: 'Standard Pass' },
    { id: 'sc-009', eventId: 'evt-001', scannedByStaffId: 'staff-1', timestamp: '2025-09-12T11:00:00Z', ticketId: 'T009', status: 'valid', ticketType: 'VIP Pass' },

    // Event 2 scans
    { id: 'sc-010', eventId: 'evt-002', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T17:30:00Z', ticketId: 'T010', status: 'valid', ticketType: 'General Admission' },
    { id: 'sc-011', eventId: 'evt-002', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T17:31:00Z', ticketId: 'T011', status: 'valid', ticketType: 'General Admission' },
    { id: 'sc-012', eventId: 'evt-002', scannedByStaffId: 'staff-2', timestamp: '2025-10-22T17:35:00Z', ticketId: 'T012', status: 'valid', ticketType: 'Premium Seat' },

    // Event 3 scans (ended event)
    { id: 'sc-013', eventId: 'evt-003', scannedByStaffId: 'staff-1', timestamp: '2025-06-15T11:00:00Z', ticketId: 'T013', status: 'valid', ticketType: 'Daily Pass' },
    { id: 'sc-014', eventId: 'evt-003', scannedByStaffId: 'staff-1', timestamp: '2025-06-15T11:01:00Z', ticketId: 'T014', status: 'valid', ticketType: 'Daily Pass' },
    { id: 'sc-015', eventId: 'evt-003', scannedByStaffId: 'staff-1', timestamp: '2025-06-16T10:00:00Z', ticketId: 'T015', status: 'valid', ticketType: 'Weekend Pass' },
];

const currentOrganizerId = 'organizer-1'; // Simulating the logged-in admin's ID

// Colors for Pie Charts
const PIE_COLORS_TICKET_TYPES = ['#1976d2', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4', '#ffeb3b'];
const PIE_COLORS_SCAN_STATUS = {
    'valid': '#4CAF50', // Green
    'duplicate': '#FFC107', // Amber/Yellow
    'expired': '#F44336', // Red
    'refunded': '#2196F3', // Blue
    'pending': '#9E9E9E', // Grey
};

// --- Helper Functions (Simulating Data Processing) ---

const processOverallAnalytics = (events, scans) => {
    let totalEvents = events.length;
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    const monthlySales = {}; // { 'YYYY-MM': { tickets: 0, revenue: 0 } }
    const topSellingEvents = {}; // { eventId: ticketsSold }
    const ticketStatusCounts = { valid: 0, duplicate: 0, expired: 0, refunded: 0 }; // Initialize all possible statuses

    events.forEach(event => {
        totalTicketsSold += event.ticketsSold;
        totalRevenue += event.revenue;
        topSellingEvents[event.id] = event.ticketsSold;

        // Populate monthly sales data from event revenue/ticket sales
        const eventMonth = new Date(event.startDate).toISOString().substring(0, 7); // YYYY-MM
        if (!monthlySales[eventMonth]) {
            monthlySales[eventMonth] = { tickets: 0, revenue: 0 };
        }
        monthlySales[eventMonth].tickets += event.ticketsSold;
        monthlySales[eventMonth].revenue += event.revenue;
    });

    // Process scan records for overall ticket status counts
    scans.forEach(scan => {
        if (ticketStatusCounts.hasOwnProperty(scan.status)) {
            ticketStatusCounts[scan.status]++;
        } else {
            // Handle any unexpected statuses by counting them as 'other' or a new category
            // For now, if status not in predefined, ignore for this specific count.
        }
    });

    // Format monthly sales for Recharts
    const sortedMonths = Object.keys(monthlySales).sort();
    const monthlySalesData = sortedMonths.map(month => ({
        month,
        tickets: monthlySales[month].tickets,
        revenue: monthlySales[month].revenue,
    }));

    // Format top selling events for Recharts
    const sortedTopEvents = Object.entries(topSellingEvents)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Top 5
        .map(([eventId, tickets]) => ({
            name: events.find(e => e.id === eventId)?.name || `Event ${eventId}`,
            ticketsSold: tickets,
        }));

    // Format ticket status counts for Recharts Pie Chart
    const ticketStatusPieData = Object.entries(ticketStatusCounts).map(([name, value]) => ({ name, value }));

    return {
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        avgTicketsPerEvent: totalEvents > 0 ? (totalTicketsSold / totalEvents).toFixed(0) : 0,
        avgRevenuePerEvent: totalEvents > 0 ? (totalRevenue / totalEvents).toFixed(2) : 0,
        monthlySalesData,
        topSellingEvents: sortedTopEvents,
        ticketStatusPieData,
    };
};

const processEventSpecificAnalytics = (event, scans) => {
    if (!event) return null;

    const eventScans = scans.filter(s => s.eventId === event.id);

    // Daily scans trend
    const dailyScans = {};
    eventScans.forEach(scan => {
        const date = new Date(scan.timestamp).toISOString().substring(0, 10); // YYYY-MM-DD
        if (!dailyScans[date]) {
            dailyScans[date] = 0;
        }
        dailyScans[date]++;
    });
    const dailyScansData = Object.entries(dailyScans)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, scans]) => ({ date, scans }));

    // Ticket type distribution for this event
    const ticketTypeCounts = {};
    eventScans.forEach(scan => {
        if (scan.ticketType) {
            if (!ticketTypeCounts[scan.ticketType]) {
                ticketTypeCounts[scan.ticketType] = 0;
            }
            ticketTypeCounts[scan.ticketType]++;
        }
    });
    const eventTicketTypePieData = Object.entries(ticketTypeCounts).map(([name, value]) => ({ name, value }));

    // Scan status distribution for this event
    const eventScanStatusCounts = { valid: 0, duplicate: 0, expired: 0, refunded: 0 };
    eventScans.forEach(scan => {
        if (eventScanStatusCounts.hasOwnProperty(scan.status)) {
            eventScanStatusCounts[scan.status]++;
        }
    });
    const eventScanStatusPieData = Object.entries(eventScanStatusCounts).map(([name, value]) => ({ name, value }));

    const checkedInCount = eventScans.filter(s => s.status === 'valid').length;

    return {
        ticketsSold: event.ticketsSold,
        totalRevenue: event.revenue,
        attendeesCheckedIn: checkedInCount,
        dailyScansData,
        eventTicketTypePieData,
        eventScanStatusPieData,
        refundsIssued: eventScans.filter(s => s.status === 'refunded').length, // Assuming 'refunded' status for scans
    };
};

// Simulate fetching data (replace with actual Firestore calls)
const fetchData = async (organizerId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const organizerEvents = dummyEvents.filter(e => e.organizerId === organizerId);
            // In a real app, you'd fetch all relevant scan records for these events
            const relevantScans = dummyScanRecords.filter(s => organizerEvents.some(e => e.id === s.eventId));
            resolve({ organizerEvents, relevantScans });
        }, 800); // Simulate network delay
    });
};

// --- PDF & Excel (CSV) Download Helpers ---

// Function to download a section as PDF
const downloadPDF = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found.`);
        return;
    }

    // Temporarily set a wider width for better PDF rendering
    const originalWidth = element.style.width;
    element.style.width = 'fit-content'; // Or a specific large pixel value if content overflows

    const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If images are from external sources
    });

    element.style.width = originalWidth; // Restore original width

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' for size
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    pdf.save(filename);
};

// Function to download data as Excel (CSV)
const downloadCSV = (data, filename, headers) => {
    let csvContent = headers.join(',') + '\n'; // Add headers
    data.forEach(row => {
        csvContent += Object.values(row).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


// --- React Component ---
export const AdminReports = () => {
    const theme = useTheme();

    const overallReportsRef = useRef(null);
    const eventSpecificReportsRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [organizerEvents, setOrganizerEvents] = useState([]);
    const [allScanRecords, setAllScanRecords] = useState([]);

    const [overallAnalytics, setOverallAnalytics] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [eventSpecificAnalytics, setEventSpecificAnalytics] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const { organizerEvents: events, relevantScans: scans } = await fetchData(currentOrganizerId);
                setOrganizerEvents(events);
                setAllScanRecords(scans);

                // Calculate overall analytics once data is loaded
                const overall = processOverallAnalytics(events, scans);
                setOverallAnalytics(overall);

            } catch (err) {
                console.error("Failed to load reports data:", err);
                setError("Failed to load reports. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Recalculate event-specific analytics when selectedEventId changes
    useEffect(() => {
        if (selectedEventId && organizerEvents.length > 0) {
            const event = organizerEvents.find(e => e.id === selectedEventId);
            const eventAnalytics = processEventSpecificAnalytics(event, allScanRecords);
            setEventSpecificAnalytics(eventAnalytics);
        } else {
            setEventSpecificAnalytics(null);
        }
    }, [selectedEventId, organizerEvents, allScanRecords]);

    const handleEventChange = (event) => {
        setSelectedEventId(event.target.value);
    };

    const handleDownloadOverallPDF = () => {
        downloadPDF('overall-reports-section', 'Overall_Event_Reports.pdf');
    };

    const handleDownloadOverallExcel = () => {
        // Prepare data for CSV for overall report
        const monthlySalesHeaders = ['Month', 'Tickets Sold', 'Revenue'];
        const monthlySalesDataForCsv = overallAnalytics.monthlySalesData.map(d => ({
            Month: d.month,
            "Tickets Sold": d.tickets,
            Revenue: d.revenue,
        }));
        const topSellingHeaders = ['Event Name', 'Tickets Sold'];
        const topSellingDataForCsv = overallAnalytics.topSellingEvents.map(d => ({
            "Event Name": d.name,
            "Tickets Sold": d.ticketsSold,
        }));
        const statusHeaders = ['Status', 'Count'];
        const statusDataForCsv = overallAnalytics.ticketStatusPieData.map(d => ({
            Status: d.name,
            Count: d.value,
        }));

        let csvContent = "Overall Key Metrics\n";
        csvContent += `Total Events:,${overallAnalytics.totalEvents}\n`;
        csvContent += `Total Tickets Sold:,${overallAnalytics.totalTicketsSold}\n`;
        csvContent += `Total Revenue:,${overallAnalytics.totalRevenue}\n`;
        csvContent += `Average Tickets Per Event:,${overallAnalytics.avgTicketsPerEvent}\n`;
        csvContent += `Average Revenue Per Event:,${overallAnalytics.avgRevenuePerEvent}\n\n`;

        csvContent += "Monthly Sales Trend\n";
        csvContent += monthlySalesHeaders.join(',') + '\n';
        monthlySalesDataForCsv.forEach(row => {
            csvContent += Object.values(row).join(',') + '\n';
        });
        csvContent += '\n';

        csvContent += "Top 5 Selling Events\n";
        csvContent += topSellingHeaders.join(',') + '\n';
        topSellingDataForCsv.forEach(row => {
            csvContent += Object.values(row).join(',') + '\n';
        });
        csvContent += '\n';

        csvContent += "Ticket Status Distribution\n";
        csvContent += statusHeaders.join(',') + '\n';
        statusDataForCsv.forEach(row => {
            csvContent += Object.values(row).join(',') + '\n';
        });
        csvContent += '\n';

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'Overall_Event_Reports.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleDownloadEventPDF = () => {
        if (selectedEventId) {
            const eventName = organizerEvents.find(e => e.id === selectedEventId)?.name || 'Selected Event';
            downloadPDF('event-specific-reports-section', `${eventName}_Event_Reports.pdf`);
        }
    };

    const handleDownloadEventExcel = () => {
        if (selectedEventId && eventSpecificAnalytics) {
            const eventName = organizerEvents.find(e => e.id === selectedEventId)?.name || 'Selected Event';

            let csvContent = `Event Specific Metrics for ${eventName}\n`;
            csvContent += `Tickets Sold:,${eventSpecificAnalytics.ticketsSold}\n`;
            csvContent += `Total Revenue:,${eventSpecificAnalytics.totalRevenue}\n`;
            csvContent += `Attendees Checked In:,${eventSpecificAnalytics.attendeesCheckedIn}\n`;
            csvContent += `Refunds Issued:,${eventSpecificAnalytics.refundsIssued}\n\n`;

            csvContent += "Daily Scans Trend\n";
            const dailyScansHeaders = ['Date', 'Scans'];
            csvContent += dailyScansHeaders.join(',') + '\n';
            eventSpecificAnalytics.dailyScansData.forEach(d => {
                csvContent += `${d.date},${d.scans}\n`;
            });
            csvContent += '\n';

            csvContent += "Ticket Type Distribution\n";
            const ticketTypeHeaders = ['Ticket Type', 'Count'];
            csvContent += ticketTypeHeaders.join(',') + '\n';
            eventSpecificAnalytics.eventTicketTypePieData.forEach(d => {
                csvContent += `${d.name},${d.value}\n`;
            });
            csvContent += '\n';

            csvContent += "Scan Status Distribution\n";
            const scanStatusHeaders = ['Status', 'Count'];
            csvContent += scanStatusHeaders.join(',') + '\n';
            eventSpecificAnalytics.eventScanStatusPieData.forEach(d => {
                csvContent += `${d.name},${d.value}\n`;
            });
            csvContent += '\n';

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${eventName}_Event_Reports.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };


    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Analytics & Reports
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading reports data...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}

            {!loading && !error && overallAnalytics && (
                <>
                    {/* Overall Account Analytics Section */}
                    <Paper elevation={3} sx={{ p: 3, mb: 4 }} id="overall-reports-section" ref={overallReportsRef}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2">
                                Overall Account Analytics
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadOverallPDF}
                                    sx={{ mr: 1 }}
                                >
                                    Download PDF
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadOverallExcel}
                                >
                                    Download Excel
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        {/* Overall Key Metrics */}
                        <Grid container spacing={3} mb={4}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.light, 0.1) }}>
                                    <EventIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Events</Typography>
                                    <Typography variant="h4" color="primary">{overallAnalytics.totalEvents}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.secondary.light, 0.1) }}>
                                    <SellIcon color="secondary" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Tickets Sold</Typography>
                                    <Typography variant="h4" color="secondary">{overallAnalytics.totalTicketsSold}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.success.light, 0.1) }}>
                                    <AttachMoneyIcon color="success" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                                    <Typography variant="h4" color="success">${overallAnalytics.totalRevenue.toLocaleString()}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.info.light, 0.1) }}>
                                    <CheckCircleOutlineIcon color="info" sx={{ fontSize: 30, mb: 1 }} />
                                    <Typography variant="h6" color="text.secondary">Avg. Tickets/Event</Typography>
                                    <Typography variant="h4" color="info">{overallAnalytics.avgTicketsPerEvent}</Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            {/* Monthly Sales Trend */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Monthly Sales Trend (Tickets & Revenue)</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <LineChart data={overallAnalytics.monthlySalesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} />
                                            <YAxis yAxisId="right" orientation="right" stroke={theme.palette.success.main} label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight' }} />
                                            <Tooltip formatter={(value, name) => [`${name}: ${name === 'revenue' ? '$' : ''}${value.toLocaleString()}`]} />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="tickets" stroke={theme.palette.primary.main} name="Tickets Sold" />
                                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={theme.palette.success.main} name="Revenue" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Top 5 Selling Events */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Top 5 Selling Events (Tickets)</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <BarChart data={overallAnalytics.topSellingEvents}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} />
                                            <YAxis label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="ticketsSold" fill={theme.palette.secondary.main} name="Tickets Sold" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Overall Ticket Status Distribution */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                    <Typography variant="h6" gutterBottom>Overall Ticket Scan Status Distribution</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <PieChart>
                                            <Pie
                                                data={overallAnalytics.ticketStatusPieData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={false}
                                            >
                                                {overallAnalytics.ticketStatusPieData.map((entry, index) => (
                                                    <Cell key={`cell-overall-${index}`} fill={PIE_COLORS_SCAN_STATUS[entry.name] || '#CCCCCC'} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Event-Specific Analytics Section */}
                    <Paper elevation={3} sx={{ p: 3 }} id="event-specific-reports-section" ref={eventSpecificReportsRef}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2">
                                Event-Specific Analytics
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadEventPDF}
                                    sx={{ mr: 1 }}
                                    disabled={!selectedEventId}
                                >
                                    Download PDF
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadEventExcel}
                                    disabled={!selectedEventId}
                                >
                                    Download Excel
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel id="select-event-report-label">Select Event for Details</InputLabel>
                            <Select
                                labelId="select-event-report-label"
                                id="select-event-report"
                                value={selectedEventId}
                                label="Select Event for Details"
                                onChange={handleEventChange}
                            >
                                <MenuItem value="">
                                    <em>None Selected</em>
                                </MenuItem>
                                {organizerEvents.map((event) => (
                                    <MenuItem key={event.id} value={event.id}>
                                        {event.name} ({new Date(event.startDate).toLocaleDateString()})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {selectedEventId && eventSpecificAnalytics ? (
                            <>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Analytics for: {organizerEvents.find(e => e.id === selectedEventId)?.name}
                                </Typography>
                                <Grid container spacing={3} mb={4}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.light, 0.1) }}>
                                            <SellIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Tickets Sold</Typography>
                                            <Typography variant="h4" color="primary">{eventSpecificAnalytics.ticketsSold}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.success.light, 0.1) }}>
                                            <AttachMoneyIcon color="success" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                                            <Typography variant="h4" color="success">${eventSpecificAnalytics.totalRevenue?.toLocaleString()}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.info.light, 0.1) }}>
                                            <CheckCircleOutlineIcon color="info" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Attendees Checked In</Typography>
                                            <Typography variant="h4" color="info">{eventSpecificAnalytics.attendeesCheckedIn}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.error.light, 0.1) }}>
                                            <CancelOutlinedIcon color="error" sx={{ fontSize: 30, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">Refunds Issued</Typography>
                                            <Typography variant="h4" color="error">{eventSpecificAnalytics.refundsIssued}</Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    {/* Daily Scans Trend */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                            <Typography variant="h6" gutterBottom>Daily Scans Trend</Typography>
                                            <ResponsiveContainer width="100%" height="80%">
                                                <LineChart data={eventSpecificAnalytics.dailyScansData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis label={{ value: 'Scans', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="scans" stroke={theme.palette.primary.main} name="Daily Scans" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>

                                    {/* Event Ticket Type Distribution */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                            <Typography variant="h6" gutterBottom>Event Ticket Type Distribution</Typography>
                                            <ResponsiveContainer width="100%" height="80%">
                                                <PieChart>
                                                    <Pie
                                                        data={eventSpecificAnalytics.eventTicketTypePieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={120}
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                        labelLine={false}
                                                    >
                                                        {eventSpecificAnalytics.eventTicketTypePieData.map((entry, index) => (
                                                            <Cell key={`cell-event-type-${index}`} fill={PIE_COLORS_TICKET_TYPES[index % PIE_COLORS_TICKET_TYPES.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>

                                    {/* Event Scan Status Distribution */}
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                                            <Typography variant="h6" gutterBottom>Event Scan Status Distribution</Typography>
                                            <ResponsiveContainer width="100%" height="80%">
                                                <PieChart>
                                                    <Pie
                                                        data={eventSpecificAnalytics.eventScanStatusPieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={120}
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                        labelLine={false}
                                                    >
                                                        {eventSpecificAnalytics.eventScanStatusPieData.map((entry, index) => (
                                                            <Cell key={`cell-event-scan-${index}`} fill={PIE_COLORS_SCAN_STATUS[entry.name] || '#CCCCCC'} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Alert severity="info">Please select an event from the dropdown above to view its specific analytics.</Alert>
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};