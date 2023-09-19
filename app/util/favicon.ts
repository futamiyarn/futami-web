export default function () {
  const favicon: HTMLLinkElement | null = document.getElementById(
    "favicon",
  ) as HTMLLinkElement | null;

  const changeFavicon = () => {
    const visibility = document.visibilityState == "visible";

    if (!(favicon instanceof HTMLLinkElement)) return;

    if (visibility) favicon.href = "/assets/favicon/favicon.svg";
    else favicon.href = "/assets/favicon/fav_dark_inactive.svg";
  };

  window.addEventListener("visibilitychange", () => changeFavicon());

  changeFavicon();
}
