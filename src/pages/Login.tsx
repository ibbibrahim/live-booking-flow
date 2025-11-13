import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Eye, EyeOff, Video, Tv2, Film, Radio } from 'lucide-react';
import logoFull from '@/assets/qbusiness-logo-full.png';
import logoIcon from '@/assets/qbusiness-logo-icon.png';

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl"></div>
        
        {/* Floating media icons */}
        <Video className="absolute top-20 left-20 text-primary/10 w-16 h-16 animate-pulse" />
        <Tv2 className="absolute bottom-32 right-32 text-accent/10 w-20 h-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <Film className="absolute top-40 right-20 text-primary/10 w-12 h-12 animate-pulse" style={{ animationDelay: '2s' }} />
        <Radio className="absolute bottom-20 left-32 text-accent/10 w-14 h-14 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Theme toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 z-10"
        onClick={toggleTheme}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="space-y-4 text-center pb-4">
          <div className="flex justify-center mb-2">
            {theme === 'dark' ? (
              <img 
                src={logoIcon} 
                alt="QBusiness" 
                className="h-16 w-auto object-contain"
              />
            ) : (
              <img 
                src={logoFull} 
                alt="QBusiness" 
                className="h-12 w-auto object-contain"
              />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to access your media dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@qbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium gap-2"
              size="lg"
            >
              <Film className="w-4 h-4" />
              Sign In to Media Dashboard
            </Button>
          </form>

          {/* Media Info */}
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <Video className="w-6 h-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Production</p>
              </div>
              <div className="space-y-1">
                <Tv2 className="w-6 h-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Broadcasting</p>
              </div>
              <div className="space-y-1">
                <Radio className="w-6 h-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Streaming</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">
        <p>© 2024 QBusiness. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
