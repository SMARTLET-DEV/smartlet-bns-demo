'use client';

import { AlertCircle, XCircle, Clock, ShieldOff } from 'lucide-react';

interface ErrorMessageProps {
    type: 'invalid' | 'expired' | 'restricted' | 'not-uploaded' | 'network' | 'generic';
    message?: string;
}

const errorConfig = {
    invalid: {
        icon: XCircle,
        title: 'Invalid Link',
        defaultMessage: 'This link is invalid or does not exist.',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        textColor: 'text-red-900 dark:text-red-100',
        descColor: 'text-red-700 dark:text-red-300',
    },
    expired: {
        icon: Clock,
        title: 'Link Expired',
        defaultMessage: 'This link has expired and is no longer active.',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        iconColor: 'text-orange-600 dark:text-orange-400',
        textColor: 'text-orange-900 dark:text-orange-100',
        descColor: 'text-orange-700 dark:text-orange-300',
    },
    restricted: {
        icon: ShieldOff,
        title: 'Access Restricted',
        defaultMessage: 'Access to these documents is currently restricted.',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        textColor: 'text-yellow-900 dark:text-yellow-100',
        descColor: 'text-yellow-700 dark:text-yellow-300',
    },
    'not-uploaded': {
        icon: AlertCircle,
        title: 'Documents Not Available',
        defaultMessage: 'Documents have not been uploaded yet.',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        textColor: 'text-blue-900 dark:text-blue-100',
        descColor: 'text-blue-700 dark:text-blue-300',
    },
    network: {
        icon: AlertCircle,
        title: 'Connection Error',
        defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        borderColor: 'border-gray-200 dark:border-gray-800',
        iconColor: 'text-gray-600 dark:text-gray-400',
        textColor: 'text-gray-900 dark:text-gray-100',
        descColor: 'text-gray-700 dark:text-gray-300',
    },
    generic: {
        icon: AlertCircle,
        title: 'Error',
        defaultMessage: 'An error occurred. Please try again later.',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        textColor: 'text-red-900 dark:text-red-100',
        descColor: 'text-red-700 dark:text-red-300',
    },
};

export default function ErrorMessage({ type, message }: ErrorMessageProps) {
    const config = errorConfig[type];
    const IconComponent = config.icon;

    return (
        <div className="max-w-2xl mx-auto">
            <div
                className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 text-center`}
            >
                <IconComponent className={`w-16 h-16 ${config.iconColor} mx-auto mb-4`} />
                <h2 className={`text-2xl font-bold ${config.textColor} mb-2`}>
                    {config.title}
                </h2>
                <p className={`${config.descColor} mb-4`}>
                    {message || config.defaultMessage}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you believe this is an error, please contact your agent for assistance.
                </p>
            </div>
        </div>
    );
}
