import React from 'react';
import { Github, Linkedin, Mail, Heart, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mysterious World</h3>
            <p className="text-sm text-muted-foreground">
              Connecting people through mysterious conversations, one message at a time.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="https://portfolio-ankit-soni.vercel.app/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Portfolio</a>
              <a href="https://drive.google.com/file/d/1VsyXpfl9ht66fMSWY5a5ku941_mee0G1/view?usp=drivesdk" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Resume</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Terms of Service</a>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/AnkitSoni03" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100009636765395&mibextid=ZbWKwL" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://www.linkedin.com/in/ankit-soni-98107b243/" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="mailto:sethankit027@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact us: sethankit027@gmail.com
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="text-sm text-muted-foreground">
              © 2025 Mysterious World. All rights reserved.
            </span>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>in the Digital World</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}