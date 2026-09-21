import React, { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { VerificationWorkspacePage } from './pages/VerificationWorkspacePage';
import { VerificationHistoryPage } from './pages/VerificationHistoryPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { SettingsPage } from './pages/SettingsPage';
import { MOCK_DOSSIERS, INITIAL_USER } from './data/mockData';
import { Dossier, UserProfile, Verdict } from './types';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [currentScreen, setCurrentScreen] = useState<string>('workspace');
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [activeDossierId, setActiveDossierId] = useState<string>('case-001');

  const handleRecordDecision = (
    dossierId: string,
    verdict: Verdict,
    reason: string,
    notes: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === dossierId
          ? {
              ...d,
              status: verdict,
              reasonCode: reason,
              reviewNotes: notes,
              reviewedBy: currentUser.name,
              reviewTimestamp: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleStartProcessing = (uploadData: any) => {
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentScreen('workspace');
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  return (
    <AppLayout
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      currentUser={currentUser}
      onSwitchUser={setCurrentUser}
      onLogout={() => setIsAuthenticated(false)}
    >
      {currentScreen === 'dashboard' && (
        <DashboardPage
          dossiers={dossiers}
          onSelectDossier={setActiveDossierId}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === 'workspace' && (
        <VerificationWorkspacePage
          dossiers={dossiers}
          activeDossierId={activeDossierId}
          onSelectDossier={setActiveDossierId}
          onRecordDecision={handleRecordDecision}
        />
      )}

      {currentScreen === 'upload' && (
        <DocumentUploadPage onStartProcessing={handleStartProcessing} />
      )}

      {currentScreen === 'processing' && (
        <ProcessingPage onComplete={handleProcessingComplete} />
      )}

      {currentScreen === 'history' && (
        <VerificationHistoryPage dossiers={dossiers} />
      )}

      {currentScreen === 'audit' && <AuditTrailPage />}

      {currentScreen === 'analytics' && <AnalyticsPage />}

      {currentScreen === 'administration' && <AdministrationPage />}

      {currentScreen === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}

export default App;
