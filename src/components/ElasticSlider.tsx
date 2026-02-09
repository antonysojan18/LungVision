
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { Volume1, Volume2 } from 'lucide-react';
import './ElasticSlider.css';

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export default function ElasticSlider({
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    className = '',
    leftIcon,
    rightIcon
}: ElasticSliderProps) {
    return (
        <div className={`slider-container ${className}`}>
            <Slider
                value={value}
                onValueChange={onValueChange}
                min={min}
                max={max}
                step={step}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            />
        </div>
    );
}

interface SliderProps {
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

function Slider({ value, onValueChange, min, max, step, leftIcon, rightIcon }: SliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [region, setRegion] = useState<'left' | 'middle' | 'right'>('middle');
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useMotionValueEvent(clientX, 'change', latest => {
        if (sliderRef.current) {
            const { left, right } = sliderRef.current.getBoundingClientRect();
            let newValue;

            if (latest < left) {
                setRegion('left');
                newValue = left - latest;
            } else if (latest > right) {
                setRegion('right');
                newValue = latest - right;
            } else {
                setRegion('middle');
                newValue = 0;
            }

            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        // Only handle if primary button is pressed
        if (e.buttons > 0 && sliderRef.current) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            // Calculate raw value based on position
            let newValue = min + ((e.clientX - left) / width) * (max - min);

            // Apply stepping
            if (step > 0) {
                newValue = Math.round(newValue / step) * step;
            }

            // Clamp value
            newValue = Math.min(Math.max(newValue, min), max);

            // Update parent
            onValueChange(newValue);

            // Update motion value for physics
            clientX.jump(e.clientX);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        handlePointerMove(e);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
    };

    const getRangePercentage = () => {
        const totalRange = max - min;
        if (totalRange === 0) return 0;
        return ((value - min) / totalRange) * 100;
    };

    return (
        <>
            <motion.div
                onHoverStart={() => animate(scale, 1.2)}
                onHoverEnd={() => animate(scale, 1)}
                onTouchStart={() => animate(scale, 1.2)}
                onTouchEnd={() => animate(scale, 1)}
                style={{
                    scale,
                    opacity: useTransform(scale, [1, 1.2], [0.7, 1])
                }}
                className="slider-wrapper"
            >
                <motion.div
                    animate={{
                        scale: region === 'left' ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 }
                    }}
                    style={{
                        x: useTransform(() => (region === 'left' ? -overflow.get() / scale.get() : 0))
                    }}
                >
                    {leftIcon || <Volume1 className="w-5 h-5" />}
                </motion.div>

                <div
                    ref={sliderRef}
                    className="slider-root"
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                >
                    <motion.div
                        style={{
                            scaleX: useTransform(() => {
                                if (sliderRef.current) {
                                    const { width } = sliderRef.current.getBoundingClientRect();
                                    return 1 + overflow.get() / width;
                                }
                                return 1;
                            }),
                            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                            transformOrigin: useTransform(() => {
                                if (sliderRef.current) {
                                    const { left, width } = sliderRef.current.getBoundingClientRect();
                                    return clientX.get() < left + width / 2 ? 'right' : 'left';
                                }
                                return 'center';
                            }),
                            height: useTransform(scale, [1, 1.2], [6, 12]),
                            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
                            marginBottom: useTransform(scale, [1, 1.2], [0, -3])
                        }}
                        className="slider-track-wrapper"
                    >
                        <div className="slider-track">
                            <div className="slider-range" style={{ width: `${getRangePercentage()}%` }}>
                                <div className="slider-thumb" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{
                        scale: region === 'right' ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 }
                    }}
                    style={{
                        x: useTransform(() => (region === 'right' ? overflow.get() / scale.get() : 0))
                    }}
                >
                    {rightIcon || <Volume2 className="w-5 h-5" />}
                </motion.div>
            </motion.div>
        </>
    );
}

function decay(value: number, max: number) {
    if (max === 0) {
        return 0;
    }

    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

    return sigmoid * max;
}
