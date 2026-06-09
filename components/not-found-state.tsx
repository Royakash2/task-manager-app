interface NotFoundStateProps {
  title?: string;
  description?: string;
}

export const NotFoundState = ({
  title = "Not found",
  description = "The requested resource may have been deleted or you may not have access to it.",
}: NotFoundStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
