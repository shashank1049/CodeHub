import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor:
                    "var(--background)",
                color: "var(--foreground)",
            }}
        >
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="max-w-3xl">

                    <p
                        className="mb-4 text-sm font-medium uppercase tracking-wider"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Developer Community
                    </p>

                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                        Build.
                        <br />
                        Showcase.
                        <br />
                        Connect.
                    </h1>

                    <p
                        className="mt-6 max-w-2xl text-lg"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        CodeHub is a platform for
                        developers to showcase their
                        projects, discover talented
                        developers, and build meaningful
                        connections.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Link
                            to="/explore"
                            className="rounded-lg px-6 py-3 font-medium"
                            style={{
                                backgroundColor:
                                    "var(--primary)",
                                color:
                                    "var(--primary-foreground)",
                            }}
                        >
                            Explore Projects
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg border px-6 py-3 font-medium"
                            style={{
                                borderColor:
                                    "var(--border)",
                                backgroundColor:
                                    "var(--surface)",
                            }}
                        >
                            Join CodeHub
                        </Link>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section
                className="border-y"
                style={{
                    borderColor:
                        "var(--border)",
                }}
            >
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">

                    <Feature
                        title="Showcase Projects"
                        description="Create a developer portfolio by showcasing your best projects, technologies, GitHub repositories, and live demos."
                    />

                    <Feature
                        title="Discover Developers"
                        description="Find developers, explore their work, follow interesting profiles, and discover new ideas."
                    />

                    <Feature
                        title="Connect & Engage"
                        description="Like projects, leave comments, follow developers, and stay updated with notifications."
                    />

                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div
                    className="rounded-2xl border p-10 text-center"
                    style={{
                        backgroundColor:
                            "var(--surface)",
                        borderColor:
                            "var(--border)",
                    }}
                >
                    <h2 className="text-3xl font-bold">
                        Ready to build your
                        developer profile?
                    </h2>

                    <p
                        className="mx-auto mt-4 max-w-xl"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Join CodeHub and put your
                        projects, skills, and developer
                        journey in one place.
                    </p>

                    <Link
                        to="/register"
                        className="mt-8 inline-block rounded-lg px-6 py-3 font-medium"
                        style={{
                            backgroundColor:
                                "var(--primary)",
                            color:
                                "var(--primary-foreground)",
                        }}
                    >
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
};

const Feature = ({
    title,
    description,
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p
                className="mt-3"
                style={{
                    color: "var(--muted)",
                }}
            >
                {description}
            </p>
        </div>
    );
};

export default Home;