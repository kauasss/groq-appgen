import { FiGitBranch } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

interface RemixButtonProps {
  sessionId?: string;
  version?: string;
  disabled?: boolean;
}

export function RemixButton({ sessionId, version, disabled }: RemixButtonProps) {
  const handleClick = () => {
    if (sessionId && version) {
      const sourceParam = `${sessionId}/${version}`;
      window.location.href = `/?source=${encodeURIComponent(sourceParam)}`;
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        data-tooltip-id="remix-tooltip"
        data-tooltip-content="Remix this app!"
      >
        <FiGitBranch className="w-5 h-5" />
      </button>
      <Tooltip id="remix-tooltip" />
    </>
  );
}
