import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import useSmoothScroll from './hooks/useSmoothScroll';

const App = () => {
    useSmoothScroll();

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;




