interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center py-20" data-testid="empty-state">
      <p className="text-white text-lg">Nenhum {message} encontrado</p>
    </div>
  );
}
