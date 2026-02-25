import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardTag = ({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}) => {
  return (
    <Card
      className="
        w-full
        max-w-md
        mx-auto
        bg-white
        dark:bg-slate-800/50
        shadow-sm
      "
    >
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {content}
      </CardContent>

      <CardFooter className="px-4 sm:px-6">
        {footer}
      </CardFooter>
    </Card>
  );
};

export default CardTag;