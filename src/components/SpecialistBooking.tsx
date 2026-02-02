import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Star, CreditCard, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import DynamicBackground from './DynamicBackground';
import AppHeader from './AppHeader';

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

const SpecialistBooking = ({ onBack }: SpecialistBookingProps) => {
  const [step, setStep] = useState<BookingStep>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

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

  return (
    <div className="min-h-screen relative">
      <DynamicBackground step={6} />
      
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
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          selectedTime === time
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
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">Payment Information</h3>
                  </div>

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

                    <Button type="submit" className="w-full glow">
                      Confirm Booking
                    </Button>
                  </form>
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

                <Card className="glass-card p-6 max-w-sm mx-auto text-left">
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

                <Button onClick={onBack} className="mt-8">
                  Back to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SpecialistBooking;
