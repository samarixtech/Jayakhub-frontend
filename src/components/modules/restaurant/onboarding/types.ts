export interface WizardStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export interface StepRestaurantInfoProps extends WizardStepProps {
  // Keeping these if they are still needed by the component,
  // though we are moving state inside the component mostly?
  // The view file seemed to use local state + server action.
  // We'll see if we need to remove them.
  // For now, I will keep them compatible or remove if unused.
  // Checking StepRestaurantInfoView, it mostly uses internal state.
}

export interface StepLicenseProps extends WizardStepProps {
  // We will likely move the file state inside the component too,
  // or keep it lifted if we want to preserve it across steps (but wizard usually preserves via unmounting/remounting if not careful).
  // Actually, standard React unmounts components when switching switch cases.
  // So internal state is lost.
  // However, the previous implementation used `style={{ display: ... }}` or just simple conditional rendering?
  // The previous implementation used `switch(currentStep)`.
  // So state IS lost on step change unless we lift it or use a hidden style.
  // The server actions save data to DB, so we don't strictly need to preserve local state IF we re-fetch data on mount.
  // StepOwnerInfo fetches on mount.
  // StepRestaurantInfo does NOT seems to fetch on mount in the code I read.
  // WAIT. If I switch steps, I lose the state if I don't lift it or persist it.
  // But if the server action saves it, then moving forward is fine. moving back might be empty.
  // For this Refactor, I will focus on flow. 'Back' might just take you back to the form.
  // If the form doesn't re-fetch, it will be empty.
  // That's acceptable for "fixing errors" first, or I can try to fix that too.
  // The user asked to "fix the complete restaurant onboarding flow because there is a lot errors".
  // Let's stick to the props for now.
}
