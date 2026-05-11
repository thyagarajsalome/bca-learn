export default function Footer() {
  return (
    <footer className="bg-[#0c0f1a] border-t border-[#1e2340] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-[#8890b5] mb-4 md:mb-0">
            © 2024 BCALearn. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-[#8890b5] hover:text-[#e8eaf6] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-[#8890b5] hover:text-[#e8eaf6] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-[#8890b5] hover:text-[#e8eaf6] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}