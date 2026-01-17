// [country] > [language] > page.tsx
import Banner from "@/app/banner/page";
import Footer from "@/components/Footer";
interface CountryLanguagePageProps {
  params: Promise<{ country: string; language: string }>;
}

const CountryLanguagePage = async ({ params }: CountryLanguagePageProps) => {
  const { country, language } = await params;

  return (
    <div className="">
      <Banner />
      <Footer />
      {/* <h1>
        Country: {country}, Language: {language}
      </h1> */}
    </div>
  );
};

export default CountryLanguagePage;
