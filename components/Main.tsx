import Dishes from "./Dishes";
import About from "./About";
import SpecialDishes from "./SpecialDishes";
type MainProps = {
  id: string;
};
function Main({ id }: MainProps) {
  console.log("the ide from main", id);
  return (
    <main className="w-full flex flex-col p-4 md:p-6 lg:p-8 bg-white transition-all">
      <SpecialDishes id={id} />
      <Dishes />
      <About />
    </main>
  );
}

export default Main;
