import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const JobDetail = lazy(() => import('./pages/JobDetail.jsx'));
const JobsPage = lazy(() => import('./pages/JobsPage.jsx'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const TrainingDetail = lazy(() => import('./pages/TrainingDetail.jsx'));
const TrainingsPage = lazy(() => import('./pages/TrainingsPage.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/trainings/:slug" element={<TrainingDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
