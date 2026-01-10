import { useEffect } from 'react';
import { analytics } from '../firebase';

// Custom hook for Firebase Analytics - completely safe implementation
export const useAnalytics = () => {
  useEffect(() => {
    // Safe page view logging - won't crash if analytics fails
    try {
      if (analytics && typeof analytics.logEvent === 'function') {
        analytics.logEvent('page_view', {
          page_title: document?.title || 'Unknown',
          page_location: window?.location?.href || 'Unknown'
        });
      }
    } catch (error) {
      console.warn('Page view tracking failed:', error);
    }
  }, []);

  // Safe event logging functions
  const logEvent = (eventName, parameters = {}) => {
    try {
      if (analytics && typeof analytics.logEvent === 'function' && eventName) {
        analytics.logEvent(eventName, parameters);
      }
    } catch (error) {
      console.warn('Event logging failed:', error);
    }
  };

  const logUserInteraction = (action, category = 'User Interaction') => {
    logEvent('user_interaction', {
      action,
      category,
      timestamp: new Date().toISOString()
    });
  };

  const logButtonClick = (buttonName, location = '', parameters = {}) => {
    logEvent('button_click', {
      button_name: buttonName,
      location,
      timestamp: new Date().toISOString(),
      ...parameters
    });
  };

  const logApiCall = (apiName, method = 'GET', success = true, error = null) => {
    logEvent('api_call', {
      api_name: apiName,
      method,
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  };

  const logLogin = (userType, success = true) => {
    logEvent('login', {
      user_type: userType,
      success,
      method: 'email_password'
    });
  };

  const logFormSubmission = (formName, success = true) => {
    logEvent('form_submission', {
      form_name: formName,
      success
    });
  };

  const logNavigation = (destination, parameters = {}) => {
    logEvent('navigation', {
      destination,
      timestamp: new Date().toISOString(),
      ...parameters
    });
  };

  const logDataFetch = (dataType, success = true, count = 0) => {
    logEvent('data_fetch', {
      data_type: dataType,
      success,
      count,
      timestamp: new Date().toISOString()
    });
  };

  return {
    logEvent,
    logUserInteraction,
    logButtonClick,
    logApiCall,
    logLogin,
    logFormSubmission,
    logNavigation,
    logDataFetch
  };
};
