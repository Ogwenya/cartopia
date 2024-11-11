import Link from "next/link";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";

const AppFooter = () => {
  const footer_items = [
    {
      title: "Company",
      links: [{ label: "About", url: "#" }],
    },
    {
      title: "Help Center",
      links: [
        { label: "Twitter", url: "#" },
        { label: "Facebook", url: "#" },
        { label: "Contact Us", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", url: "#" },
        { label: "Terms & Conditions", url: "#" },
      ],
    },
  ];

  const socials = [
    { name: "Facebook", url: "", icon: Facebook },
    { name: "Twitter", url: "", icon: TwitterLogoIcon },
    { name: "Instagram", url: "", icon: InstagramLogoIcon },
  ];

  return (
    <footer class="p-4 bg-white sm:p-6 z-[99]">
      <div class="mx-auto max-w-screen-xl">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
            <Link href="/" class="flex items-center">
              <img
                src="/images/logo-icon.png"
                class="mr-3 h-8"
                alt="Cartopia Logo"
              />
              <span class="self-center text-2xl font-semibold whitespace-nowrap">
                Cartopia
              </span>
            </Link>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {footer_items.map((item) => (
              <div key={item.title}>
                <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  {item.title}
                </h2>
                <ul class="text-gray-600">
                  {item.links.map((link_item) => (
                    <li class="mb-4" key={link_item.label}>
                      <Link href={link_item.url} class="hover:underline">
                        {link_item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-gray-500 sm:text-center">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="https://flowbite.com" class="hover:underline">
              Cartopia™
            </Link>
            . All Rights Reserved.
          </span>
          <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            {socials.map((entry) => (
              <Link
                href="#"
                class="text-gray-500 hover:text-gray-900"
                key={entry.name}
              >
                <entry.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
