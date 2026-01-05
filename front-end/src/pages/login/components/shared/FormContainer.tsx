interface FormContainerProps {
  children: React.ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="mx-auto my-4 w-full text-center">
      <div className="space-y-2">
        <div className="my-8 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
