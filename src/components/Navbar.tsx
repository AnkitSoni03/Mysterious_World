"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Menu, X, MessageCircle, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    
    const user = session?.user as User

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <nav className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-black/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="h-6 w-6 text-black dark:text-white" />
                        <Link 
                            href="/" 
                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-400 hover:opacity-80 transition-opacity"
                        >
                            Mysterious World
                        </Link>
                    </div>
    
                    <div className="hidden md:flex items-center space-x-6">
                        {session ? (
                            <>
                                <span className="text-gray-700 dark:text-gray-300 text-sm">
                                    Welcome, <span className="font-semibold text-black dark:text-white">{user?.name || user?.email}</span>
                                </span>
                                <Button 
                                    onClick={() => signOut()}
                                    variant="outline"
                                    className="border-gray-300 text-black dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-all px-6 py-2 rounded-full shadow-lg">
                                    Login
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            {isDarkMode ? 
                                <Sun className="h-5 w-5 text-yellow-500" /> : 
                                <Moon className="h-5 w-5 text-gray-600" />
                            }
                        </Button>
                    </div>
    
                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            {isDarkMode ? 
                                <Sun className="h-5 w-5 text-yellow-500" /> : 
                                <Moon className="h-5 w-5 text-gray-600" />
                            }
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-black dark:text-white"
                        >
                            {isMenuOpen ? 
                                <X size={24} className="text-black dark:text-white" /> : 
                                <Menu size={24} />
                            }
                        </Button>
                    </div>
                </div>
            </div>
    
            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute w-full bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 shadow-lg">
                    <div className="px-4 py-3 space-y-3">
                        {session ? (
                            <>
                                <div className="px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Welcome, <span className="font-semibold text-black dark:text-white">{user?.name || user?.email}</span>
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => signOut()}
                                    variant="outline"
                                    className="w-full border-gray-300 text-black dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in" className="block">
                                <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-all px-6 py-2 rounded-full shadow-lg">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
    
}