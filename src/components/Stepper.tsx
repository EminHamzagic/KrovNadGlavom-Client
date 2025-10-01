import { motion } from "framer-motion";

export interface StepObj {
  id: number;
  label: string;
}

interface StepperProps {
  step: number;
  stepArray: StepObj[];
}

export default function Stepper({ step, stepArray }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {stepArray.map((s, index) => {
        const isActive = step === s.id;
        const isCompleted = step > s.id;

        return (
          <div key={s.id} className="flex items-center w-full">
            {/* Step Circle */}
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isActive || isCompleted ? "#c7671e" : "#e5e7eb",
                color: isActive || isCompleted ? "#fff" : "#6b7280",
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-300"
            >
              {s.id}
            </motion.div>

            {/* Step Label */}
            <motion.span
              animate={{
                color: isActive ? "#c7671e" : "#6b7280",
                fontWeight: isActive ? 600 : 400,
              }}
              className="ml-2 text-sm transition-colors duration-300 hidden sm:flex"
            >
              {s.label}
            </motion.span>

            {/* Connector line */}
            {index !== stepArray.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-gray-200 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step > s.id ? "100%" : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 left-0 h-0.5 bg-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
