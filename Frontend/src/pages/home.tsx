import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/common/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import './home.css';
 
const Index = () => {
  useEffect(() => {
    document.title = 'Smart Hotel Management System';
  }, []);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-0 m-0"
    style={{
      backgroundImage: `url("https://tse2.mm.bing.net/th/id/OIP.bnvlG3GpjYgpX8-uk-b7JAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="w-full max-w-6xl flex items-center justify-center p-6">
        <div className="hero-section">
          <h1 className="hero-title">
            Smart Hotel Management System
          </h1>
          <p className="hero-subtitle">
            Streamline hotel operations with our comprehensive management platform.
            From bookings to reviews, manage everything in one place.
          </p>
         
          <div className="action-buttons">
            <Button asChild size="lg" className="action-button action-button-primary">
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </Button>
           
            <Button asChild variant="outline" size="lg" className="action-button action-button-secondary">
              <Link to="/register" className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Index;
 