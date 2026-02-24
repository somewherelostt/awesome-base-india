"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Rocket, Shield, Sparkles } from "lucide-react";
import { categories } from "@/lib/data";

const steps = [
  { id: 1, label: "Project", icon: Rocket },
  { id: 2, label: "Builder", icon: Shield },
  { id: 3, label: "Links", icon: Sparkles },
];

export function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    category: "",
    founderName: "",
    twitter: "",
    projectUrl: "",
    batch: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function nextStep() {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }

  function prevStep() {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center rounded-3xl border border-[#0052FF]/20 bg-[#0052FF]/5 py-20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0052FF]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        >
          <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
        </motion.div>
        <motion.h3
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          You&apos;re in the queue
        </motion.h3>
        <motion.p
          className="mt-3 max-w-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          We&apos;ll verify onchain activity + builder identity. Once approved,
          you land in the directory.
        </motion.p>
        <motion.button
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(1);
            setFormData({
              projectName: "",
              description: "",
              category: "",
              founderName: "",
              twitter: "",
              projectUrl: "",
              batch: "",
            });
          }}
          className="mt-10 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Submit Another
        </motion.button>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-4 text-sm text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex items-center justify-center gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/25"
                  : isCompleted
                  ? "bg-[#0052FF]/10 text-[#0052FF]"
                  : "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="projectName" className="mb-2 block text-sm font-medium text-foreground">
                Project Name
              </label>
              <input
                id="projectName"
                name="projectName"
                type="text"
                required
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. PayBase"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
                What does it do?
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="One paragraph about your project..."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Pick one</option>
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="batch" className="mb-2 block text-sm font-medium text-foreground">
                  Batch / Program
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Optional</option>
                  <option value="Batch 1">Batch 1</option>
                  <option value="Batch 2">Batch 2</option>
                  <option value="Base Fellowship">Base Fellowship</option>
                  <option value="Hyperthon">Hyperthon</option>
                  <option value="Activation">Activation</option>
                  <option value="Independent">Independent</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="founderName" className="mb-2 block text-sm font-medium text-foreground">
                Your Name
              </label>
              <input
                id="founderName"
                name="founderName"
                type="text"
                required
                value={formData.founderName}
                onChange={handleChange}
                placeholder="Full name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="twitter" className="mb-2 block text-sm font-medium text-foreground">
                Twitter / X Handle
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  @
                </span>
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  required
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="yourhandle"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&apos;ll use your X handle to verify builder identity. Your profile will appear
                in the Founder Connect section so others can reach you.
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="projectUrl" className="mb-2 block text-sm font-medium text-foreground">
                Project URL
              </label>
              <input
                id="projectUrl"
                name="projectUrl"
                type="url"
                required
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="https://yourproject.xyz"
                className={inputClass}
              />
            </div>

            <div className="rounded-2xl border border-[#0052FF]/20 bg-[#0052FF]/5 p-5 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">What we check</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Base contract / onchain activity",
                  "Working product or demo",
                  "India-based builder signals",
                  "At least one proof link",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0052FF]/10">
                      <Check className="h-3 w-3 text-[#0052FF]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="rounded-full border border-neutral-200 dark:border-neutral-800 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          <button
            type="submit"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0052FF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052FF]/25 transition-all hover:bg-[#0047e0] hover:shadow-xl hover:shadow-[#0052FF]/30"
          >
            Submit for Review
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </form>
  );
}
