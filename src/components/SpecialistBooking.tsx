import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import BookingReceipt, { BookingData } from './BookingReceipt';
import { usePatient } from '@/contexts/PatientContext';

interface SpecialistBookingProps {
  onBack: () => void;
}

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialty: 'Pulmonologist',
    rating: 4.9,
    experience: '15 years',
    image: '👩‍⚕️',
  },
  {
    id: 2,
    name: 'Dr. Michael Roberts',
    specialty: 'Oncologist',
    rating: 4.8,
    experience: '20 years',
    image: '👨‍⚕️',
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    specialty: 'Thoracic Surgeon',
    rating: 4.9,
    experience: '18 years',
    image: '👩‍⚕️',
  },
  {
    id: 4,
    name: 'Dr. James Kim',
    specialty: 'Pulmonologist',
    rating: 4.7,
    experience: '12 years',
    image: '👨‍⚕️',
  },
];

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
      <span className="font-semibold">$150.00</span>
    </div>
    <div className="flex justify-between mb-4">
      <span className="text-muted-foreground">Platform Fee</span>
      <span className="font-semibold">$10.00</span>
    </div>
    <div className="flex justify-between text-lg font-bold">
      <span>Total</span>
      <span className="text-primary">$160.00</span>
    </div>
  </div>
);

const SpecialistBooking = ({ onBack }: SpecialistBookingProps) => {
  const [step, setStep] = useState<BookingStep>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { patientData } = usePatient(); // Get patient name

  const handleDoctorSelect = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setStep('schedule');
  };

  const handleScheduleConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
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
    doctorName: selectedDoctor?.name || 'Specialist',
    specialty: selectedDoctor?.specialty || 'General Practice',
    date: selectedDate?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) || 'Date TBD',
    time: selectedTime,
    bookingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: '$160.00',
    paymentMethod: paymentMethod
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
                {step === 'schedule' && `Book with ${selectedDoctor?.name}`}
                {step === 'payment' && 'Complete your booking'}
                {step === 'success' && 'Your appointment has been scheduled'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Doctor Selection */}
            {step === 'doctors' && (
              <motion.div
                key="doctors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="glass-card p-6 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                          {doctor.image}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                          <p className="text-sm text-primary">{doctor.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {doctor.rating}
                            </span>
                            <span>{doctor.experience}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
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
                          <Input id="cardName" placeholder="John Doe" required />
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
                          Pay with Card
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

                        <div className="flex flex-wrap gap-2 py-2">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                            <motion.button
                              key={app}
                              type="button"
                              className="px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/10 text-sm transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {app}
                            </motion.button>
                          ))}
                        </div>

                        <PaymentSummary />

                        <Button type="submit" className="w-full glow">
                          Pay with UPI
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
                            {/* Simulated QR Code */}
                            <div className="w-full h-full bg-foreground/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-0.5">
                                {Array.from({ length: 64 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'} rounded-sm`}
                                  />
                                ))}
                              </div>
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
                        >
                          I've Completed Payment
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 mx-auto rounded-full bg-particle-safe/20 flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-particle-safe" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-8">
                  Your appointment with {selectedDoctor?.name} is scheduled.
                </p>

                <Card className="glass-card p-6 max-w-sm mx-auto text-left mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor</span>
                      <span className="font-medium">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {selectedDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download Confirmation'}
                  </Button>
                  <Button onClick={onBack}>
                    Back to Dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Hidden container for generating Booking Receipt PDF */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <BookingReceipt ref={receiptRef} data={bookingData} />
      </div>
    </div>
  );
};

export default SpecialistBooking;
