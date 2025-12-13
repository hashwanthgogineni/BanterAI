import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate("/chat");
        } else {
            navigate("/auth");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Animated background gradient */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 animate-gradient"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                            <h1 className="text-xl sm:text-2xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Banter AI
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleGetStarted} variant="default" size="sm" className="h-9 px-4 font-light">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
                <div className="text-center space-y-8">
                    {/* Main Headline with Wave Effect */}
                    <h1 className="text-6xl md:text-8xl font-banter font-light leading-tight">
                        <span className="inline-block animate-wave-text bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                            Conversations
                        </span>
                        <br />
                        <span className="inline-block animate-wave-text-delayed bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Reimagined
                        </span>
                    </h1>

                    {/* Subheadline with Sarcasm */}
                    <p className="text-lg md:text-xl font-extralight text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
                        Finally, an AI that gets your sense of humor. Banter AI serves up witty comebacks,
                        sarcastic quips, and perfectly timed roasts. Because who needs boring conversations?
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center justify-center gap-4 pt-8 animate-slide-up delay-200">
                        <Button
                            onClick={handleGetStarted}
                            size="lg"
                            className="h-14 px-8 text-lg font-light group hover:scale-105 transition-transform"
                        >
                            Start Chatting
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Stats with Sarcasm */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16 animate-fade-in delay-300">
                        <div className="text-center">
                            <div className="text-4xl font-light text-primary">Witty</div>
                            <div className="text-sm font-light text-muted-foreground mt-1">Sharp as a Tack</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-light text-primary">Sassy</div>
                            <div className="text-sm font-light text-muted-foreground mt-1">Attitude Included</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-light text-primary">Savage</div>
                            <div className="text-sm font-light text-muted-foreground mt-1">No Filter Needed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 py-32">
                <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center gradient-bg">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-light text-white">
                            Ready to Experience the Future?
                        </h2>
                        <p className="text-xl font-light text-white/90 max-w-2xl mx-auto">
                            Join thousands of users already having amazing conversations with Banter AI
                        </p>
                        <Button
                            onClick={handleGetStarted}
                            size="lg"
                            variant="secondary"
                            className="h-14 px-8 text-lg font-light bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform mt-8"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                                <h1 className="text-xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    Banter AI
                                </h1>
                            </Link>
                        </div>
                        <p className="text-sm font-light text-muted-foreground">
                            © 2024 Banter AI. All rights reserved. (Yes, even the sarcasm)
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
