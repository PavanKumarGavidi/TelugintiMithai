import { Marquee } from "../components/ui";
import { About, CategoryMosaic, Featured, Gallery } from "./home/Sections";
import { Hero, Offers } from "./home/Hero";
import { Contact, Locations, Reviews } from "./home/Community";

const MARQUEE_ITEMS = [
  "Boorelu",
  "Madatha Kaja",
  "Ghee Halwa",
  "Kaju Katli",
  "Ariselu",
  "Janthikalu",
  "Bobbatlu",
  "Pootharekulu",
  "Bellam Sunundalu",
  "Karam Mixture",
  "Sannakayalu",
  "Karappusa",
];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <Offers />
      <Featured />
      <CategoryMosaic />
      <About />
      <Gallery />
      <Reviews />
      <Locations />
      <Contact />
    </>
  );
}
