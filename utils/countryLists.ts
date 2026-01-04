export function getCountryFlagEmoji(Location: string): string {
  const cleanLocation = Location.trim().toLowerCase();

  const country = countryList.find((country) =>
    cleanLocation.includes(country.name.toLowerCase())
  );

  return country?.flagEmoji || "";
}

export function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export const countryList = [
  {
    name: "Afghanistan",
    code: "AF",
    phoneCode: "+93",
    flagEmoji: "AF",
    flag: "https://flagcdn.com/h40/af.png",
  },
  {
    name: "Aland Islands",
    code: "AX",
    phoneCode: "+358",
    flagEmoji: "ax",
    flag: "https://flagcdn.com/h40/ax.png",
  },
  {
    name: "Albania",
    code: "AL",
    phoneCode: "+355",
    flagEmoji: "AL",
    flag: "https://flagcdn.com/h40/al.png",
  },
  {
    name: "Algeria",
    code: "DZ",
    phoneCode: "+213",
    flagEmoji: "DZ",
    flag: "https://flagcdn.com/h40/dz.png",
  },
  {
    name: "American Samoa",
    code: "AS",
    phoneCode: "+1-684",
    flagEmoji: "AS",
    flag: "https://flagcdn.com/h40/as.png",
  },
  {
    name: "Andorra",
    code: "AD",
    phoneCode: "+376",
    flagEmoji: "AD",
    flag: "https://flagcdn.com/h40/ad.png",
  },
  {
    name: "Angola",
    code: "AO",
    phoneCode: "+244",
    flagEmoji: "AO",
    flag: "https://flagcdn.com/h40/ao.png",
  },
  {
    name: "Anguilla",
    code: "AI",
    phoneCode: "+1-264",
    flagEmoji: "AI",
    flag: "https://flagcdn.com/h40/ai.png",
  },
  {
    name: "Antarctica",
    code: "AQ",
    phoneCode: "+672",
    flagEmoji: "AQ",
    flag: "https://flagcdn.com/h40/aq.png",
  },
  {
    name: "Antigua and Barbuda",
    code: "AG",
    phoneCode: "+1-268",
    flagEmoji: "AG",
    flag: "https://flagcdn.com/h40/ag.png",
  },
  {
    name: "Argentina",
    code: "AR",
    phoneCode: "+54",
    flagEmoji: "AR",
    flag: "https://flagcdn.com/h40/ar.png",
  },
  {
    name: "Armenia",
    code: "AM",
    phoneCode: "+374",
    flagEmoji: "AM",
    flag: "https://flagcdn.com/h40/am.png",
  },
  {
    name: "Aruba",
    code: "AW",
    phoneCode: "+297",
    flagEmoji: "AW",
    flag: "https://flagcdn.com/h40/aw.png",
  },
  {
    name: "Australia",
    code: "AU",
    phoneCode: "+61",
    flagEmoji: "AU",
    flag: "https://flagcdn.com/h40/au.png",
  },
  {
    name: "Austria",
    code: "AT",
    phoneCode: "+43",
    flagEmoji: "AT",
    flag: "https://flagcdn.com/h40/at.png",
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    phoneCode: "+994",
    flagEmoji: "AZ",
    flag: "https://flagcdn.com/h40/az.png",
  },
  {
    name: "Bahamas",
    code: "BS",
    phoneCode: "+1-242",
    flagEmoji: "BS",
    flag: "https://flagcdn.com/h40/bs.png",
  },
  {
    name: "Bahrain",
    code: "BH",
    phoneCode: "+973",
    flagEmoji: "BH",
    flag: "https://flagcdn.com/h40/bh.png",
  },
  {
    name: "Bangladesh",
    code: "BD",
    phoneCode: "+880",
    flagEmoji: "BD",
    flag: "https://flagcdn.com/h40/bd.png",
  },
  {
    name: "Barbados",
    code: "BB",
    phoneCode: "+1-246",
    flagEmoji: "BB",
    flag: "https://flagcdn.com/h40/bb.png",
  },
  {
    name: "Belarus",
    code: "BY",
    phoneCode: "+375",
    flagEmoji: "BY",
    flag: "https://flagcdn.com/h40/by.png",
  },
  {
    name: "Belgium",
    code: "BE",
    phoneCode: "+32",
    flagEmoji: "BE",
    flag: "https://flagcdn.com/h40/be.png",
  },
  {
    name: "Belize",
    code: "BZ",
    phoneCode: "+501",
    flagEmoji: "BZ",
    flag: "https://flagcdn.com/h40/bz.png",
  },
  {
    name: "Benin",
    code: "BJ",
    phoneCode: "+229",
    flagEmoji: "BJ",
    flag: "https://flagcdn.com/h40/bj.png",
  },
  {
    name: "Bermuda",
    code: "BM",
    phoneCode: "+1-441",
    flagEmoji: "BM",
    flag: "https://flagcdn.com/h40/bm.png",
  },
  {
    name: "Bhutan",
    code: "BT",
    phoneCode: "+975",
    flagEmoji: "BT",
    flag: "https://flagcdn.com/h40/bt.png",
  },
  {
    name: "Bolivia",
    code: "BO",
    phoneCode: "+591",
    flagEmoji: "BO",
    flag: "https://flagcdn.com/h40/bo.png",
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    phoneCode: "+387",
    flagEmoji: "BA",
    flag: "https://flagcdn.com/h40/ba.png",
  },
  {
    name: "Botswana",
    code: "BW",
    phoneCode: "+267",
    flagEmoji: "BW",
    flag: "https://flagcdn.com/h40/bw.png",
  },
  {
    name: "Brazil",
    code: "BR",
    phoneCode: "+55",
    flagEmoji: "BR",
    flag: "https://flagcdn.com/h40/br.png",
  },
  {
    name: "Canada",
    code: "CA",
    phoneCode: "+1",
    flagEmoji: "CA",
    flag: "https://flagcdn.com/h40/ca.png",
  },
  {
    name: "China",
    code: "CN",
    phoneCode: "+86",
    flagEmoji: "CN",
    flag: "https://flagcdn.com/h40/cn.png",
  },
  {
    name: "France",
    code: "FR",
    phoneCode: "+33",
    flagEmoji: "FR",
    flag: "https://flagcdn.com/h40/fr.png",
  },
  {
    name: "Germany",
    code: "DE",
    phoneCode: "+49",
    flagEmoji: "DE",
    flag: "https://flagcdn.com/h40/de.png",
  },
  {
    name: "India",
    code: "IN",
    phoneCode: "+91",
    flagEmoji: "IN",
    flag: "https://flagcdn.com/h40/in.png",
  },
  {
    name: "Japan",
    code: "JP",
    phoneCode: "+81",
    flagEmoji: "JP",
    flag: "https://flagcdn.com/h40/jp.png",
  },
  {
    name: "Mexico",
    code: "MX",
    phoneCode: "+52",
    flagEmoji: "MX",
    flag: "https://flagcdn.com/h40/mx.png",
  },
  {
    name: "Pakistan",
    code: "PK",
    phoneCode: "+92",
    flagEmoji: "PK",
    flag: "https://flagcdn.com/h40/pk.png",
  },
  {
    name: "United Kingdom",
    code: "GB",
    phoneCode: "+44",
    flagEmoji: "GB",
    flag: "https://flagcdn.com/h40/gb.png",
  },
  {
    name: "United States",
    code: "US",
    phoneCode: "+1",
    flagEmoji: "US",
    flag: "https://flagcdn.com/h40/us.png",
  },
];
