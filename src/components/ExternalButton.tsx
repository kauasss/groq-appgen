import { FiExternalLink } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

interface ExternalButtonProps {
  sessionId?: string;
  version?: string;
  disabled?: boolean;
}

export function ExternalButton({ sessionId, version, disabled }: ExternalButtonProps) {
  const handleOpen = () => {
    if (sessionId && version) {
      window.open(`/apps/${sessionId}/${version}`, '_blank');
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={disabled}
        className={`p-2 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7B66] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        data-tooltip-id="external-tooltip"
        data-tooltip-content={disabled ? 'Preview not available yet' : 'Open in new tab'}
      >
        <FiExternalLink size={20} />
      </button>
      <Tooltip id="external-tooltip" />
    </>
  );
}
