import { Routes, Route } from 'react-router-dom';
import Auth from '../../page/Auth';
import Home from '../../page/Home';
function AppRouter({ isLoggedIn }) {
  return (
    <Routes>
      {isLoggedIn ? (
        <Route path="/" element={<Home />} />
      ) : (
        <Route path="/" element={<Auth />} />
      )}
    </Routes>
  );
}

export default AppRouter;
