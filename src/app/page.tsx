import Contacts from "./contacts/page";
import Favorites from "./favorites/page"

export default function Overview() {
  return (
    <>
      <section>

       <Favorites />
        <Contacts />
      </section>
    </>
  );
}
