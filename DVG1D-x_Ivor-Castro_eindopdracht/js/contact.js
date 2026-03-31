
fetch("https://dvg-2526-webscripting.github.io/webscripting-eindopdracht-api/contacts/contact3.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    toonContact(data);
  })
  .catch(function (fout) {
    document.querySelector("#laad-tekst").textContent = "Er ging iets mis bij het laden van de contactgegevens.";
    console.error("Fetch fout:", fout);
  });

function toonContact(data) {
  let wrapper = document.querySelector("#contact-wrapper");

  
  let urenHtml = "";
  let dagen = Object.keys(data.openingsuren);
  for (let i = 0; i < dagen.length; i++) {
    let dag = dagen[i];
    let uur = data.openingsuren[dag];
    let gesloten = uur === "gesloten";
    urenHtml += `
      <div class="uur-rij ${gesloten ? "gesloten" : ""}">
        <span class="dag">${dag.charAt(0).toUpperCase() + dag.slice(1)}</span>
        <span class="uur">${uur}</span>
      </div>
    `;
  }

  
  let sociaalHtml = "";
  if (data.sociale_media.facebook) {
    sociaalHtml += `<a href="${data.sociale_media.facebook}" target="_blank" class="sociaal-link">Facebook</a>`;
  }
  if (data.sociale_media.instagram) {
    sociaalHtml += `<a href="${data.sociale_media.instagram}" target="_blank" class="sociaal-link">Instagram</a>`;
  }
  if (data.sociale_media.twitter) {
    sociaalHtml += `<a href="${data.sociale_media.twitter}" target="_blank" class="sociaal-link">Twitter</a>`;
  }

  
  wrapper.innerHTML = `
    <div class="contact-grid">

      <div class="panel contact-info">
        <img src="${data.logo_url}" alt="Logo ${data.naam}" class="contact-logo">
        <h2>${data.naam}</h2>
        <p class="categorie">${data.categorie}</p>

        <div class="info-blok">
          <h3>Contactpersoon</h3>
          <p>${data.contactpersoon.naam}</p>
          <p class="sub">${data.contactpersoon.functie}</p>
        </div>

        <div class="info-blok">
          <h3>Adres</h3>
          <p>${data.adres.straat} ${data.adres.nummer}</p>
          <p>${data.adres.postcode} ${data.adres.stad}</p>
        </div>

        <div class="info-blok">
          <h3>Contact</h3>
          <p><a href="tel:${data.telefoon}" class="contact-link">${data.telefoon}</a></p>
          <p><a href="mailto:${data.email}" class="contact-link">${data.email}</a></p>
          <p><a href="${data.website}" target="_blank" class="contact-link">${data.website}</a></p>
        </div>

        <div class="info-blok">
          <h3>Sociale media</h3>
          <div class="sociaal-groep">
            ${sociaalHtml}
          </div>
        </div>
      </div>

      <div class="panel openingsuren-box">
        <h2>Openingsuren</h2>
        <div class="uren-lijst">
          ${urenHtml}
        </div>
      </div>

    </div>
  `;
}
