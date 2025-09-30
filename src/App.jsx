// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import './i18n';

// // Layouts и страницы
// import MainLayout from './MainLayout';
// import Hero from './components/Hero';
// import Section from './components/Section.jsx';
// import Authors from './pages/Authors.jsx';
// import Associations from './pages/Associations.jsx';
// import News from './components/News';
// import BooksPage from './pages/Books';
// import NewsDetailPage from './pages/NewsDetailPage';
// import PublishingSlider from './components/PublishingSlider';
// import Contact from './pages/Contact';

// import Journal1Layout from './pages/Journal1/Journal1Layout.jsx';
// import Journal1 from './pages/Journal1/Journal1.jsx';
// import Indexing1 from './pages/Journal1/Indexing1.jsx';
// import Editorial1 from './pages/Journal1/Editorial1.jsx';
// import Archive1 from './pages/Journal1/Archive1.jsx';
// import Search1 from './pages/Journal1/SearchJournal1.jsx';
// import IssuePage1 from './pages/Journal1/IssuePage1.jsx';
// import ArticlePage1 from './pages/Journal1/ArticlePage1.jsx';

// import Journal2Layout from './pages/Journal2/Journal2Layout.jsx';
// import Journal2 from './pages/Journal2/Journal2.jsx';
// import Indexing2 from './pages/Journal2/Indexing2.jsx';
// import Editorial2 from './pages/Journal2/Editorial2.jsx';
// import Archive2 from './pages/Journal2/Archive2.jsx';
// import Search2 from './pages/Journal2/SearchJournal2.jsx';
// import IssuePage2 from './pages/Journal2/IssuePage2.jsx';
// import ArticlePage2 from './pages/Journal2/ArticlePage2.jsx';

// import JournalsPage from './pages/JournalsPage';

// // Админка
// import AdminLayout from './admin/AdminLayout';
// import PublishersPage from './admin/pages/PublishersPage';
// import JournalsAdminPage from './admin/pages/JournalAdminPage/JournalsAdminPage.jsx';
// import BooksAdminPage from './admin/pages/BooksAdminPage';
// import AuthorsPage from './admin/pages/AuthorsPage';
// import NewsPage from './admin/pages/NewsPage.jsx';
// import CategoriesSection from './admin/pages/JournalAdminPage/CategoriesSection.jsx';
// import ArticlesSection from './admin/pages/JournalAdminPage/ArticlesSection.jsx';
// import JournalsSection from './admin/pages/JournalAdminPage/JournalsSection.jsx';
// import AssociationsAdminPage from './admin/pages/AssociationsAdminPage.jsx';
// import ContactAdminPage from './admin/pages/ContactAdminPage.jsx';

// // Контексты
// import { JournalsProvider } from './context/JournalsContext.jsx';
// import { ForAuthorsProvider } from './context/forAuthorsContext.jsx';
// import { NewsProvider } from './context/NewsContext.jsx';
// import { PublishingSliderProvider } from './context/PublishingSliderContext.jsx';
// import { BooksProvider } from './context/BooksContext.jsx';
// import { AssociationsProvider } from './context/AssociationsContext.jsx';
// import { CategoriesProvider } from './context/СategoriesContext.jsx';
// import { ArticlesProvider } from './context/ArticlesContext.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';
// import { ContactProvider } from './context/ContactContext.jsx';

// // Логин и защита
// import Login from './auth/Login.jsx';
// import PrivateRoute from './auth/PrivateRoute.jsx';

// // Хук для динамического фавикона
// function useAdminFavicon() {
//   const location = useLocation();
//   useEffect(() => {
//     const favicon = document.querySelector("link[rel='icon']");
//     if (!favicon) return;
//     favicon.href = location.pathname.startsWith("/admin") ? "data:," : "/favicon.png";
//   }, [location]);
// }

// function FaviconHandler() {
//   useAdminFavicon();
//   return null;
// }

// // Главная страница
// function Home() {
//   return (
//     <>
//       <Hero />
//       <Section />
//       <News />
//       <PublishingSlider />
//     </>
//   );
// }

// function App() {
//   useEffect(() => {
//     import('aos').then(({ default: AOS }) => {
//       AOS.init({ duration: 800, once: true });
//     });
//   }, []);

//   return (
//     <AuthProvider>
//       <NewsProvider>
//         <ContactProvider>
//           <PublishingSliderProvider>
//             <JournalsProvider>
//               <ForAuthorsProvider>
//                 <BooksProvider>
//                   <AssociationsProvider>
//                     <CategoriesProvider>
//                       <ArticlesProvider>
//                         <Router>
//                           <FaviconHandler />
//                           <Routes>
//                             {/* Админка */}
//                             <Route path="/admin/login" element={<Login />} />
//                             <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
//                               <Route index element={<AuthorsPage />} />
//                               <Route path="authors" element={<AuthorsPage />} />
//                               <Route path="news" element={<NewsPage />} />
//                               <Route path="publishers" element={<PublishersPage />} />
//                               <Route path="journals" element={<JournalsAdminPage />}>
//                                 <Route path="journals" element={<JournalsSection />} />
//                                 <Route path="categories" element={<CategoriesSection />} />
//                                 <Route path="articles" element={<ArticlesSection />} />
//                               </Route>
//                               <Route path="associations" element={<AssociationsAdminPage />} />
//                               <Route path="books" element={<BooksAdminPage />} />
//                               <Route path="contact" element={<ContactAdminPage />} />
//                             </Route>

//                             {/* Главный сайт */}
//                             <Route path="/" element={<MainLayout />}>
//                               <Route index element={<Home />} />
//                               <Route path="authors" element={<Authors />} />
//                               <Route path="books" element={<BooksPage />} />
//                               <Route path="associations" element={<Associations />} />
//                               <Route path="news" element={<News />} />
//                               <Route path="news/:id" element={<NewsDetailPage />} />
//                               <Route path="publishing" element={<PublishingSlider />} />
//                               <Route path="contact" element={<Contact />} />
//                               <Route path="journals" element={<JournalsPage />} />

//                               {/* Журнал nntiik */}
//                               <Route path="journal/nntiik" element={<Journal1Layout />}>
//                                 <Route index element={<Journal1 />} />
//                                 <Route path="indexing1" element={<Indexing1 />} />
//                                 <Route path="editorial1" element={<Editorial1 />} />
//                                 <Route path="archive1" element={<Archive1 />} />
//                                 <Route path="search1" element={<Search1 />} />
//                                 <Route path=":year/:issueNumber" element={<IssuePage1 />} />
//                                 <Route path="article/:id" element={<ArticlePage1 />} />
//                               </Route>

//                               {/* Журнал ivk */}
//                               <Route path="journal/ivk" element={<Journal2Layout />}>
//                                 <Route index element={<Journal2 />} />
//                                 <Route path="indexing2" element={<Indexing2 />} />
//                                 <Route path="editorial2" element={<Editorial2 />} />
//                                 <Route path="archive2" element={<Archive2 />} />
//                                 <Route path="search2" element={<Search2 />} />
//                                 <Route path=":year/:issueNumber" element={<IssuePage2 />} />
//                                 <Route path="article/:id" element={<ArticlePage2 />} />
//                               </Route>
//                             </Route>
//                           </Routes>
//                         </Router>
//                       </ArticlesProvider>
//                     </CategoriesProvider>
//                   </AssociationsProvider>
//                 </BooksProvider>
//               </ForAuthorsProvider>
//             </JournalsProvider>
//           </PublishingSliderProvider>
//         </ContactProvider>
//       </NewsProvider>
//     </AuthProvider>
//   );
// }

// export default App;
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './i18n';

// Layouts и страницы
import MainLayout from './MainLayout';
import Hero from './components/Hero';
import Section from './components/Section.jsx';
import Authors from './pages/Authors.jsx';
import Associations from './pages/Associations.jsx';
import News from './components/News';
import BooksPage from './pages/Books';
import NewsDetailPage from './pages/NewsDetailPage';
import PublishingSlider from './components/PublishingSlider';
import Contact from './pages/Contact';

import Journal1Layout from './pages/Journal1/Journal1Layout.jsx';
import Journal1 from './pages/Journal1/Journal1.jsx';
import Indexing1 from './pages/Journal1/Indexing1.jsx';
import Editorial1 from './pages/Journal1/Editorial1.jsx';
import Archive1 from './pages/Journal1/Archive1.jsx';
import Search1 from './pages/Journal1/SearchJournal1.jsx';
import IssuePage1 from './pages/Journal1/IssuePage1.jsx';
import ArticlePage1 from './pages/Journal1/ArticlePage1.jsx';

import Journal2Layout from './pages/Journal2/Journal2Layout.jsx';
import Journal2 from './pages/Journal2/Journal2.jsx';
import Indexing2 from './pages/Journal2/Indexing2.jsx';
import Editorial2 from './pages/Journal2/Editorial2.jsx';
import Archive2 from './pages/Journal2/Archive2.jsx';
import Search2 from './pages/Journal2/SearchJournal2.jsx';
import IssuePage2 from './pages/Journal2/IssuePage2.jsx';
import ArticlePage2 from './pages/Journal2/ArticlePage2.jsx';

import JournalsPage from './pages/JournalsPage';

// Админка
import AdminLayout from './admin/AdminLayout';
import PublishersPage from './admin/pages/PublishersPage';
import JournalsAdminPage from './admin/pages/JournalAdminPage/JournalsAdminPage.jsx';
import BooksAdminPage from './admin/pages/BooksAdminPage';
import AuthorsPage from './admin/pages/AuthorsPage';
import NewsPage from './admin/pages/NewsPage.jsx';
import CategoriesSection from './admin/pages/JournalAdminPage/CategoriesSection.jsx';
import ArticlesSection from './admin/pages/JournalAdminPage/ArticlesSection.jsx';
import JournalsSection from './admin/pages/JournalAdminPage/JournalsSection.jsx';
import AssociationsAdminPage from './admin/pages/AssociationsAdminPage.jsx';
import ContactAdminPage from './admin/pages/ContactAdminPage.jsx';

// Контексты
import { JournalsProvider } from './context/JournalsContext.jsx';
import { ForAuthorsProvider } from './context/forAuthorsContext.jsx';
import { NewsProvider } from './context/NewsContext.jsx';
import { PublishingSliderProvider } from './context/PublishingSliderContext.jsx';
import { BooksProvider } from './context/BooksContext.jsx';
import { AssociationsProvider } from './context/AssociationsContext.jsx';
import { CategoriesProvider } from './context/СategoriesContext.jsx';
import { ArticlesProvider } from './context/ArticlesContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ContactProvider } from './context/ContactContext.jsx';

// Логин и защита
import Login from './auth/Login.jsx';
import PrivateRoute from './auth/PrivateRoute.jsx';

// Хук для динамического фавикона
function useAdminFavicon() {
  const location = useLocation();
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;
    favicon.href = location.pathname.startsWith("/admin") ? "data:," : "/favicon.png";
  }, [location]);
}

function FaviconHandler() {
  useAdminFavicon();
  return null;
}

// Главная страница
function Home() {
  return (
    <>
      <Hero />
      <Section />
      <News />
      <PublishingSlider />
    </>
  );
}

function App() {
  useEffect(() => {
    import('aos').then(({ default: AOS }) => {
      AOS.init({ duration: 800, once: true });
    });
  }, []);

  return (
    <AuthProvider>
      <NewsProvider>
        <ContactProvider>
          <PublishingSliderProvider>
            <JournalsProvider>
              <ForAuthorsProvider>
                <BooksProvider>
                  <AssociationsProvider>
                    <CategoriesProvider>
                      <ArticlesProvider>
                        <Router>
                          <FaviconHandler />
                          <Routes>
                            {/* Редиректы старых путей */}
                            <Route path="/journal1" element={<Navigate to="/journal/nntiik" replace />} />
                            <Route path="/journal2" element={<Navigate to="/journal/ivk" replace />} />

                            {/* Админка */}
                            <Route path="/admin/login" element={<Login />} />
                            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                              <Route index element={<AuthorsPage />} />
                              <Route path="authors" element={<AuthorsPage />} />
                              <Route path="news" element={<NewsPage />} />
                              <Route path="publishers" element={<PublishersPage />} />
                              <Route path="journals" element={<JournalsAdminPage />}>
                                <Route path="journals" element={<JournalsSection />} />
                                <Route path="categories" element={<CategoriesSection />} />
                                <Route path="articles" element={<ArticlesSection />} />
                              </Route>
                              <Route path="associations" element={<AssociationsAdminPage />} />
                              <Route path="books" element={<BooksAdminPage />} />
                              <Route path="contact" element={<ContactAdminPage />} />
                            </Route>

                            {/* Главный сайт */}
                            <Route path="/" element={<MainLayout />}>
                              <Route index element={<Home />} />
                              <Route path="authors" element={<Authors />} />
                              <Route path="books" element={<BooksPage />} />
                              <Route path="associations" element={<Associations />} />
                              <Route path="news" element={<News />} />
                              <Route path="news/:id" element={<NewsDetailPage />} />
                              <Route path="publishing" element={<PublishingSlider />} />
                              <Route path="contact" element={<Contact />} />
                              <Route path="journals" element={<JournalsPage />} />

                              {/* Журнал nntiik */}
                              <Route path="journal/nntiik" element={<Journal1Layout />}>
                                <Route index element={<Journal1 />} />
                                <Route path="indexing1" element={<Indexing1 />} />
                                <Route path="editorial1" element={<Editorial1 />} />
                                <Route path="archive1" element={<Archive1 />} />
                                <Route path="search1" element={<Search1 />} />
                                <Route path=":year/:issueNumber" element={<IssuePage1 />} />
                                <Route path="article/:id" element={<ArticlePage1 />} />
                              </Route>

                              {/* Журнал ivk */}
                              <Route path="journal/ivk" element={<Journal2Layout />}>
                                <Route index element={<Journal2 />} />
                                <Route path="indexing2" element={<Indexing2 />} />
                                <Route path="editorial2" element={<Editorial2 />} />
                                <Route path="archive2" element={<Archive2 />} />
                                <Route path="search2" element={<Search2 />} />
                                <Route path=":year/:issueNumber" element={<IssuePage2 />} />
                                <Route path="article/:id" element={<ArticlePage2 />} />
                              </Route>
                            </Route>
                          </Routes>
                        </Router>
                      </ArticlesProvider>
                    </CategoriesProvider>
                  </AssociationsProvider>
                </BooksProvider>
              </ForAuthorsProvider>
            </JournalsProvider>
          </PublishingSliderProvider>
        </ContactProvider>
      </NewsProvider>
    </AuthProvider>
  );
}

export default App;
