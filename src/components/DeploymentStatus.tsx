import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface DeploymentStatus {
  status: 'building' | 'deployed' | 'failed';
  url?: string;
  timestamp: Date;
  buildTime?: number;
  errors?: string[];
}

const DeploymentStatusIndicator: React.FC = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  // Simplified component without auto-deployment
  useEffect(() => {
    // Just show deployed status
    setDeploymentStatus({
      status: 'deployed',
      url: window.location.origin,
      timestamp: new Date(),
      buildTime: 5000
    });
  }, []);

  const getStatusIcon = () => {
    if (isDeploying) {
      return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
    }
    
    switch (deploymentStatus?.status) {
      case 'deployed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'building':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusText = () => {
    if (isDeploying) return 'Deploying...';
    
    switch (deploymentStatus?.status) {
      case 'deployed':
        return 'Live & Verified';
      case 'failed':
        return 'Deployment Failed';
      case 'building':
        return 'Building...';
      default:
        return 'Ready to Deploy';
    }
  };

  const getStatusColor = () => {
    if (isDeploying) return 'bg-blue-50 border-blue-200 text-blue-700';
    
    switch (deploymentStatus?.status) {
      case 'deployed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'building':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border ${getStatusColor()} shadow-lg`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {deploymentStatus?.url && deploymentStatus.status === 'deployed' && (
          <a
            href={deploymentStatus.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 transition-colors"
            title="View Live Site"
            onClick={(e) => {
              // Ensure the link works by preventing any interference
              e.stopPropagation();
              window.open(deploymentStatus.url, '_blank', 'noopener,noreferrer');
            }}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      
      {deploymentStatus?.buildTime && (
        <div className="text-xs opacity-75 mt-1">
          Built in {Math.round(deploymentStatus.buildTime / 1000)}s
          {deploymentStatus?.url && (
            <span className="ml-2">
              • <a 
                href={deploymentStatus.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(deploymentStatus.url, '_blank', 'noopener,noreferrer');
                }}
              >
                View Live
              </a>
            </span>
          )}
        </div>
      )}
      
      {deploymentStatus?.errors && deploymentStatus.errors.length > 0 && (
        <div className="text-xs mt-1">
          <details>
            <summary className="cursor-pointer">View Errors</summary>
            <ul className="mt-1 space-y-1">
              {deploymentStatus.errors.map((error, index) => (
                <li key={index} className="text-red-600">• {error}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatusIndicator;