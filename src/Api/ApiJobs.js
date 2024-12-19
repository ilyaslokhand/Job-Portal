import superbaseclinet from "@/Utils/Superbase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const superbase = await superbaseclinet(token);

  // Start constructing the query
  let query = superbase
    .from("Jobs")
    .select("*, company:Compaines(name, logo_url), SavedJobs(Jobs(id))");
  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error Fetching Jobs:", error);
    return [];
  }

  return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
  const superbase = await superbaseclinet(token);

  console.log("savedata is:", saveData);

  if (alreadySaved) {
    const { data, error: DeleteError } = await superbase
      .from("SavedJobs")
      .delete()
      .eq("Job_id", saveData.Job_id);

    if (DeleteError) {
      console.log("Error Deleting Saved Jobs:", DeleteError);
      return data;
    }
    return data;
  } else {
    const { data, error: insertError } = await superbase
      .from("SavedJobs")
      .insert([saveData])
      .select();
    if (insertError) {
      console.log("Error Deleting Saved Jobs:", insertError);
      return data;
    }
    return data;
  }
}

export async function getSingleJob(token, { Job_id }) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Jobs")
    .select("*,company:Compaines(name, logo_url), Application: Application(*)")
    .eq("id", Job_id)
    .single();

  if (error) {
    console.log("Error fectching Job:", error);
    return null;
  }
  return data;
}

export async function UpdateHiringStatus(token, { Job_id }, isOpen) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Jobs")
    .update({ isOpen })
    .eq("id", Job_id)
    .select();
  if (error) {
    console.log("Error Updating Job:", error);
    return null;
  }
  return data;
}

export async function addNewJob(token, _, JobData) {
  const superbase = await superbaseclinet(token);

  // Sanitize JobData
  for (const key in JobData) {
    if (typeof JobData[key] === "string" && JobData[key].trim() === "") {
      JobData[key] = null; // Replace empty strings with null
    }
  }

  const { data, error } = await superbase
    .from("Jobs")
    .insert([JobData])
    .select();

  if (error) {
    console.log("Error Creating Job:", error);
    return null;
  }
  return data;
}

export async function deletejob(token, { Job_id }) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Jobs")
    .delete()
    .eq("id", Job_id)
    .select();

  if (error) {
    console.log("Error Deleting Job:", error);
    return null;
  }
  return data;
}
