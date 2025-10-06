import Button from '@components/ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      {buttonLabel && onButtonClick && (
        <div className="relative mt-8">
          <Button onClick={onButtonClick} className="px-4 py-2 text-sm">
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
