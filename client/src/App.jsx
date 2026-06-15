import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Hub = lazy(() => import('./pages/Hub'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Exams = lazy(() => import('./pages/Exams'));
const ExamYears = lazy(() => import('./pages/ExamYears'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Practice = lazy(() => import('./pages/Practice'));
const PracticeTopic = lazy(() => import('./pages/PracticeTopic'));
const Tips = lazy(() => import('./pages/Tips'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminExams = lazy(() => import('./pages/Admin/AdminExams'));
const AdminTips = lazy(() => import('./pages/Admin/AdminTips'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hub" element={<Hub />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/exams/:examId" element={<ExamYears />} />
              <Route path="/quiz/:examId/:year" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/practice/:sectionId" element={<PracticeTopic />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="exams" element={<AdminExams />} />
                <Route path="tips" element={<AdminTips />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
              <Route path="*" element={
                <div className="text-center py-20 px-mobile">
                  <h2 className="font-display text-display text-gray-400 mb-2">404</h2>
                  <p className="font-body-lg text-body-lg text-gray-500">Page not found</p>
                </div>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
