import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, CreditCard, CheckCircle, ArrowLeft, Clock, Smartphone, QrCode, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DynamicBackground from './DynamicBackground';
import AppHeader from './AppHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import BookingReceipt, { BookingData } from './BookingReceipt';
import { usePatient } from '@/contexts/PatientContext';
import { useTheme } from '@/contexts/ThemeContext';

// Payment Logos
import gpayLogo from '@/assets/gpay.png';
import phonepeLogo from '@/assets/phonepe.png';
import paytmLogo from '@/assets/paytm.png';
import bhimLogo from '@/assets/bhim.png';
import amazonpayLogo from '@/assets/amazonpay.png';
import supermoneyLogo from '@/assets/supermoney.png';
import { api, Doctor } from '@/lib/api';

interface SpecialistBookingProps {
  onBack: () => void;
}

// Doctors fetched from API

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

type BookingStep = 'doctors' | 'schedule' | 'payment' | 'success';

const PaymentSummary = () => (
  <div className="pt-4 border-t border-border">
    <div className="flex justify-between mb-2">
      <span className="text-muted-foreground">Consultation Fee</span>
      <span className="font-semibold">₹490.00</span>
    </div>
    <div className="flex justify-between mb-4">
      <span className="text-muted-foreground">Platform Fee</span>
      <span className="font-semibold">₹10.00</span>
    </div>
    <div className="flex justify-between text-lg font-bold">
      <span>Total</span>
      <span className="text-primary">₹500.00</span>
    </div>
  </div>
);

const SpecialistBooking = ({ onBack }: SpecialistBookingProps) => {
  const [step, setStep] = useState<BookingStep>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { patientData, predictionResult } = usePatient();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const risk = predictionResult?.prediction;
        const data = await api.getDoctors(risk);
        setDoctors(data);
      } catch (error) {
        console.error('Failed to load doctors', error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [predictionResult]);

  useEffect(() => {
    if (step === 'success') {
      setShowReceipt(false);
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = theme === 'dark'
        ? ['#FF4081', '#E040FB', '#7C4DFF', '#536DFE'] // Pink/Purple/Blue for Dark
        : ['#00BCD4', '#00E5FF', '#1DE9B6', '#0091EA']; // Cyan/Teal/Blue for Light

      const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 50, colors };

      // Delay receipt appearance
      const receiptTimer = setTimeout(() => {
        setShowReceipt(true);
      }, 2500);

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearInterval(interval);
        clearTimeout(receiptTimer);
      };
    }
  }, [step]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('schedule');
  };

  const handleScheduleConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) return;

    setIsBooking(true);
    try {
      await api.bookAppointment({
        patientName: patientData.name || 'Valued Patient',
        diagnosis: predictionResult?.prediction || 'Unknown',
        confidence: predictionResult?.confidence || 0,
        doctorName: selectedDoctor.Name,
        specialty: selectedDoctor.Specialty,
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
        amount: '₹500.00',
        paymentMethod: paymentMethod
      });
      setStep('success');
    } catch (error) {
      console.error('Booking failed:', error);
      // Ideally show toast here
    } finally {
      setIsBooking(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Booking-Confirmation-${patientData.name || 'Patient'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Prepare booking data for receipt
  const bookingData: BookingData = {
    patientName: patientData.name || 'Valued Patient',
    doctorName: selectedDoctor?.Name || 'Specialist',
    specialty: selectedDoctor?.Specialty || 'General Practice',
    date: selectedDate?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) || 'Date TBD',
    time: selectedTime,
    bookingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: '₹500.00',
    paymentMethod: paymentMethod,
    timestamp: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  return (
    <div className="min-h-screen relative">
      <DynamicBackground step={8} />

      <AppHeader />

      <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            {step !== 'success' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={step === 'doctors' ? onBack : () => setStep('doctors')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {step === 'doctors' && 'Select a Specialist'}
                {step === 'schedule' && 'Schedule Appointment'}
                {step === 'payment' && 'Payment Details'}
                {step === 'success' && 'Booking Confirmed!'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {step === 'doctors' && 'Choose from our network of certified specialists'}
                {step === 'schedule' && `Book with ${selectedDoctor?.Name}`}
                {step === 'payment' && 'Complete your booking'}
                {step === 'success' && 'Your appointment has been scheduled'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Doctor Selection */}
            {step === 'doctors' && (
              isLoadingDoctors ? (
                <div className="flex justify-center p-12 col-span-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <motion.div
                  key="doctors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2 mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Doctors Available {selectedCity !== "All Cities" && `in ${selectedCity}`}
                    </h2>
                    <div className="w-[200px]">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="glass-card border-primary/20 bg-background/50">
                          <SelectValue placeholder="Filter by City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Cities">All Cities</SelectItem>
                          {Array.from(new Set(doctors.map(d => d.Location))).sort().map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {doctors
                    .filter(doctor => selectedCity === "All Cities" || doctor.Location === selectedCity)
                    .map((doctor) => (
                      <motion.div
                        key={doctor.ID}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="glass-card p-6 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-3xl">
                              {doctor.ImageURL ? (
                                <img src={doctor.ImageURL} alt={doctor.Name} className="w-full h-full object-cover" />
                              ) : (
                                <span>👨‍⚕️</span>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-foreground">{doctor.Name}</h3>
                              <p className="text-sm text-primary">{doctor.Specialty}</p>
                              <p className="text-xs text-muted-foreground">{doctor.Hospital}, {doctor.Location}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  {doctor.Rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              )
            )}

            {/* Step 2: Schedule */}
            {step === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <Card className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="pointer-events-auto"
                  />
                </Card>

                <Card className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Select Time</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${selectedTime === time
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Clock className="w-4 h-4" />
                        {time}
                      </motion.button>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-6"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleScheduleConfirm}
                  >
                    Continue to Payment
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card p-6 max-w-md mx-auto">
                  <Tabs defaultValue="card" className="w-full" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Card</span>
                      </TabsTrigger>
                      <TabsTrigger value="upi" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="hidden sm:inline">UPI</span>
                      </TabsTrigger>
                      <TabsTrigger value="qr" className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span className="hidden sm:inline">QR Code</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Card Payment */}
                    <TabsContent value="card">
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="Antony" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" maxLength={5} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" maxLength={4} required />
                          </div>
                        </div>

                        <PaymentSummary />

                        <Button type="submit" className="w-full glow">
                          {isBooking ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Pay with Card'
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* UPI Payment */}
                    <TabsContent value="upi">
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input
                            id="upiId"
                            placeholder="yourname@upi"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 py-2">
                          {[
                            { id: 'GPay', logo: <img src={gpayLogo} alt="GPay" className="h-16 w-auto object-contain" /> },
                            { id: 'PhonePe', logo: <img src={phonepeLogo} alt="PhonePe" className="h-12 w-auto object-contain" /> },
                            { id: 'Paytm', logo: <img src={paytmLogo} alt="Paytm" className="h-16 w-auto object-contain" /> },
                            { id: 'BHIM', logo: <img src={bhimLogo} alt="BHIM" className="h-16 w-auto object-contain" /> },
                            { id: 'AmazonPay', logo: <img src={amazonpayLogo} alt="Amazon Pay" className="h-16 w-auto object-contain" /> },
                            { id: 'SuperMoney', logo: <img src={supermoneyLogo} alt="Super.money" className="h-12 w-auto object-contain" /> },
                          ].map((app) => (
                            <motion.button
                              key={app.id}
                              type="button"
                              className="h-24 flex items-center justify-center p-4 rounded-xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {app.logo}
                            </motion.button>
                          ))}
                        </div>

                        <PaymentSummary />

                        <Button type="submit" className="w-full glow" disabled={isBooking}>
                          {isBooking ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Pay with UPI'
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* QR Code Payment */}
                    <TabsContent value="qr">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center py-4">
                          <motion.div
                            className="w-48 h-48 bg-white rounded-xl p-3 mb-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-2">
                              <QRCode
                                value="upi://pay?pa=LungVisionAI@upi&pn=LungVision%20AI&am=500&cu=INR"
                                size={256}
                                style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                              />
                            </div>
                          </motion.div>
                          <p className="text-sm text-muted-foreground text-center">
                            Scan with any UPI app to pay
                          </p>
                        </div>

                        <PaymentSummary />

                        <Button
                          type="button"
                          onClick={handlePaymentSubmit}
                          className="w-full glow"
                          disabled={isBooking}
                        >
                          {isBooking ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying Payment...
                            </>
                          ) : (
                            "I've Completed Payment"
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <AnimatePresence mode="wait">
                {!showReceipt ? (
                  <motion.div
                    key="tick-animation"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center justify-center py-20 min-h-[400px]"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)] mb-8 animate-bounce-subtle">
                      <Check className="w-12 h-12 text-white stroke-[4]" />
                    </div>
                    <h2 className="text-4xl font-bold text-center text-foreground drop-shadow-sm">Booking Confirmed!</h2>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-receipt"
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="max-w-md mx-auto"
                  >
                    <div
                      ref={receiptRef}
                      className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[24px] shadow-2xl overflow-hidden relative border border-white/20 dark:border-white/10 ring-1 ring-black/5"
                    >
                      {/* Vibrant Header - Dynamic Colors */}
                      {/* Light: Cyan to Blue | Dark: Pinkish Red */}
                      <div
                        className="relative text-white text-center pt-10 pb-12 px-8 bg-gradient-to-br from-cyan-700/60 to-cyan-900/60 dark:from-rose-400/70 dark:to-pink-500/70 backdrop-blur-md"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                          WebkitPrintColorAdjust: 'exact',
                          printColorAdjust: 'exact'
                        }}
                      >
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/30 tracking-wide shadow-sm">
                          <span className="flex items-center gap-2 drop-shadow-sm">
                            LUNGVISION AI
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 drop-shadow-md">Payment Success</h2>
                        <p className="text-white/90 text-sm font-medium drop-shadow-sm">Your health journey begins.</p>
                      </div>

                      {/* Success Icon */}
                      <div className="relative -mt-10 flex justify-center mb-4 z-10">
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 text-[#00BCD4] dark:text-[#FF4081]">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="px-8 pb-8 pt-2">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Patient Name</span>
                            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-dashed border-slate-200 dark:border-slate-700 pb-1">
                              {patientData.name || 'Valued Patient'}
                            </div>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Transaction ID</span>
                            <div className="text-lg font-mono text-slate-800 dark:text-slate-100 border-b border-dashed border-slate-200 dark:border-slate-700 pb-1 text-sm pt-1">
                              {bookingData.bookingId}
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Specialist</span>
                          <div className="text-lg font-semibold text-[#00BCD4] dark:text-[#FF4081] flex items-center gap-2">
                            <span className="bg-[#00BCD4]/10 dark:bg-[#FF4081]/10 p-1 rounded-md">
                              👨‍⚕️
                            </span>
                            {selectedDoctor?.Name}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date</span>
                            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {selectedDate?.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Time</span>
                            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {selectedTime}
                            </div>
                          </div>
                        </div>

                        {/* Total Section */}
                        <div className="bg-slate-50/60 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex justify-between items-center mb-8 backdrop-blur-sm">
                          <div>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Amount Paid</span>
                            <span className="text-green-600 dark:text-green-400 font-bold text-sm flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-slate-800 dark:text-white">
                            {bookingData.amount}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <Button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full h-12 bg-slate-800 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {isDownloading ? 'Downloading...' : 'Download Receipt'}
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={onBack}
                            className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold"
                          >
                            Return to Home
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Hidden container for generating Booking Receipt PDF */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <BookingReceipt ref={pdfRef} data={bookingData} />
      </div>
    </div >
  );
};

export default SpecialistBooking;
