/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StatCards } from './components/dashboard/StatCards';
import { StorageOverview } from './components/dashboard/StorageOverview';
import { RecentProjects } from './components/dashboard/RecentProjects';
import { FileList } from './components/files/FileList';
import { FilePreviewModal } from './components/files/FilePreviewModal';
import { ShareModal } from './components/files/ShareModal';
import { FileUploaderModal } from './components/files/FileUploader';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { SharedFilesView } from './components/share/SharedFilesView';
import { ClientPortalView } from './components/share/ClientPortalView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpView } from './components/help/HelpView';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { MobileNav } from './components/layout/MobileNav';
import { Sparkles, UploadCloud } from 'lucide-react';

function DashboardContent() {
  const {
    user,
    currentView,
    activeShareToken,
    setUploadModalOpen,
  } = useVault();

  // If a client share token is active, show the Client Portal
  if (activeShareToken) {
    return <ClientPortalView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Welcome banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Welcome back, {user?.name || 'Rakib'}!
                  <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                </h1>
                <p className="mt-1 text-xs text-purple-200/70">
                  {user?.agencyName || 'Neomathic Studios'} · Here is your client asset overview today
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Files</span>
                </button>
              </div>
            </div>

            {/* 4 Statistics Cards */}
            <StatCards />

            {/* Storage breakdown */}
            <StorageOverview />

            {/* Recent Client Projects */}
            <RecentProjects />

            {/* Recent Deliverables list */}
            <div className="pt-2">
              <FileList
                title="Recent Client Deliverables"
                subtitle="All active files across projects ready for client preview & download"
              />
            </div>
          </div>
        );

      case 'files':
        return <FileList />;

      case 'projects':
        return <ProjectList />;

      case 'project-detail':
        return <ProjectDetail />;

      case 'shared':
        return <SharedFilesView />;

      case 'favorites':
        return (
          <FileList
            isFavoriteFilter={true}
            title="Starred Deliverables"
            subtitle="Quickly reference your highest-priority creative assets"
          />
        );

      case 'trash':
        return (
          <FileList
            isTrashFilter={true}
            title="Trash Vault"
            subtitle="Files in trash can be restored anytime or deleted permanently"
          />
        );

      case 'settings':
        return <SettingsView />;

      case 'help':
        return <HelpView />;

      default:
        return <FileList />;
    }
  };

  return (
    <div className="min-h-screen bg-[#100D25] text-white">
      <Navbar />

      <div className="mx-auto flex max-w-7xl">
        {/* Persistent Workspace Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Dynamic Main Stage Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <FilePreviewModal />
      <ShareModal />
      <FileUploaderModal />
      <CreateProjectModal />
    </div>
  );
}

function MainApp() {
  const { isAuthenticated, login, activeShareToken } = useVault();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If visiting directly with a share link parameter
  if (activeShareToken) {
    return <ClientPortalView />;
  }

  // If user is not signed in, show the marketing landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#100D25]">
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} isLanding={true} />
        <LandingPage
          onOpenAuth={() => setAuthModalOpen(true)}
          onExploreDemo={() => login('raqkibrony@gmail.com', 'clientvault2026')}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <DashboardContent />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <VaultProvider>
      <MainApp />
    </VaultProvider>
  );
}
