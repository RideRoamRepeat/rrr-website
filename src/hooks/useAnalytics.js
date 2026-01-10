import { useEffect } from 'react';
import { analytics } from '../firebase';

// Custom hook for Firebase Analytics
export const useAnalytics = () => {
  useEffect(() => {
    // Log page view
    analytics.logEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href
    });
  }, []);

  // Function to log custom events
  const logEvent = (eventName, parameters = {}) => {
    analytics.logEvent(eventName, parameters);
  };

  // Function to log user interactions
  const logUserInteraction = (action, category = 'User Interaction') => {
    analytics.logEvent('user_interaction', {
      action,
      category,
      timestamp: new Date().toISOString()
    });
  };

  // Function to track button clicks
  const logButtonClick = (buttonName, location = '', parameters = {}) => {
    analytics.logEvent('button_click', {
      button_name: buttonName,
      location,
      timestamp: new Date().toISOString(),
      ...parameters
    });
  };

  // Function to track API calls
  const logApiCall = (apiName, method = 'GET', success = true, error = null) => {
    analytics.logEvent('api_call', {
      api_name: apiName,
      method,
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  };

  // Function to track login events
  const logLogin = (userType, success = true) => {
    analytics.logEvent('login', {
      user_type: userType,
      success,
      method: 'email_password'
    });
  };

  // Function to track form submissions
  const logFormSubmission = (formName, success = true) => {
    analytics.logEvent('form_submission', {
      form_name: formName,
      success
    });
  };

  // Function to track navigation
  const logNavigation = (destination, parameters = {}) => {
    analytics.logEvent('navigation', {
      destination,
      timestamp: new Date().toISOString(),
      ...parameters
    });
  };

  // Function to track data fetching
  const logDataFetch = (dataType, success = true, count = 0) => {
    analytics.logEvent('data_fetch', {
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
