import { useState } from "react";
import LoginContent from "./components/login/loginContent";
import PersonalFields from "./components/registration/personalFields";
import AccessFields from "./components/registration/accessFields";
import SuccessRegistration from "./components/successRegistration";
import LoginLayout from "./components/loginLayout";
import { signIn } from "@/services/signIn";
import type { PersonalFormData } from "./components/registration/PersonalFormFields";
import type { AccessFormData } from "./components/registration/AccessFormFields";
import { getHeaderConfig } from "./headerConfig";

export type FormStep = "login" | "personal" | "access" | "success";

export type RegistrationData = PersonalFormData & AccessFormData;

export default function Login() {
  const [currentStep, setCurrentStep] = useState<FormStep>("login");
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});

  const handleNextFromPersonal = (data: PersonalFormData) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    setCurrentStep("access");
  };

  const handleRegister = async (data: AccessFormData) => {
    const finalData = { ...registrationData, ...data };

    const response = await signIn(finalData as RegistrationData);
    if (response === true) {
      setCurrentStep("success");
      return true;
    } else {
      return response;
    }
  };

  const getHeader = () => getHeaderConfig(currentStep);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "login":
        return <LoginContent onRegisterClick={() => setCurrentStep("personal")} />;
      case "personal":
        return (
          <PersonalFields
            onCancel={() => setCurrentStep("login")}
            onNext={handleNextFromPersonal}
          />
        );
      case "access":
        return (
          <AccessFields onBack={() => setCurrentStep("personal")} onRegister={handleRegister} />
        );
      case "success":
        return <SuccessRegistration onBackToLogin={() => setCurrentStep("login")} />;
    }
  };

  return (
    <LoginLayout {...getHeader()}>
      <div className="relative overflow-hidden">
        <div
          key={currentStep}
          className="animate-in slide-in-from-right-5 fade-in duration-300 ease-in-out"
        >
          {renderCurrentStep()}
        </div>
      </div>
    </LoginLayout>
  );
}
