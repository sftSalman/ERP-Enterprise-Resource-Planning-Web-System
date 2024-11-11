import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = () => {
    const router = useRouter();
    const path = router.asPath; // Use `asPath` to get the current path including query parameters
    const paths = path.split("/").filter((item) => item !== ""); // Filter out empty strings from split

    const lastPath = paths[paths.length - 1];

    // Remove query parameters from the last path element
    const lastIndex = lastPath.indexOf("?");
    if (lastIndex !== -1) {
      paths[paths.length - 1] = lastPath.substring(0, lastIndex);
    }

    return (
        <nav className="flex mb-5 mt-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <Link href="/" passHref>
                        <span className="text-gray-700 hover:text-gray-900 inline-flex items-center">
                            <svg
                                className="w-5 h-5 mr-2.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Home
                        </span>
                    </Link>
                </li>
                {paths.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {index === paths.length - 1 ? (
                                <span className="ml-1 md:ml-2 text-sm font-medium capitalize text-gray-400">
                                    {item}
                                </span>
                            ) : item === "settings" ? (
                                <span className="ml-1 md:ml-2 text-sm font-medium capitalize text-gray-700 hover:text-gray-900 cursor-pointer">
                                    {item}
                                </span>
                            ): (item === "settings" || item === "banca") ? (
                                <span className="ml-1 md:ml-2 text-sm font-medium capitalize text-gray-700 hover:text-gray-900 cursor-pointer">
                                    {item}
                                </span>
                            ) : (
                                <Link href={`/${paths.slice(0, index + 1).join("/")}`} passHref>
                                    <span className="ml-1 md:ml-2 text-sm font-medium capitalize text-gray-700 hover:text-gray-900">
                                        {item}
                                    </span>
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
