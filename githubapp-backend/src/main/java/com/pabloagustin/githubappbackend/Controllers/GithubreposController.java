	package com.pabloagustin.githubappbackend.Controllers;

	import com.fasterxml.jackson.databind.JsonNode;
	import com.fasterxml.jackson.databind.ObjectMapper;
	import com.fasterxml.jackson.databind.node.ObjectNode;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.CrossOrigin;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.RestController;
	import org.springframework.web.client.RestTemplate;

	import java.util.ArrayList;
	import java.util.List;

	@RestController
	@CrossOrigin
	public class GithubreposController {

		private final String GITHUB_API_BASE_URL = "https://api.github.com/search/repositories";
		private final RestTemplate restTemplate = new RestTemplate();

		@GetMapping("/api/repositories")
		public ResponseEntity<String> searchRepositories(
				@RequestParam(name = "query") String query,
				@RequestParam(name = "language", required = false) String language
		){

			try{
				// URL for the GitHub API Request
				String apiURL = GITHUB_API_BASE_URL + "?q=" + query;
				if (language != null && !language.isEmpty()){
					apiURL += "+language:" + language;
				}

				// Sorting by stars
				apiURL += "&sort=stars&order=desc&page=1&per_page=10";

				// Making the Http GET request to the GitHub API
				String apiResponse = restTemplate.getForObject(apiURL, String.class);

				// Parse the JSON response
				ObjectMapper objectMapper = new ObjectMapper();
				JsonNode rootNode = objectMapper.readTree(apiResponse);
				JsonNode itemsNode = rootNode.get("items");

				// Create a new JSON array with the sorted repos
				List<JsonNode> repositoriesList = new ArrayList<>();
				itemsNode.elements().forEachRemaining(repositoriesList::add);

				// Sort the repos by stars (desc)
				repositoriesList.sort((repo1, repo2) -> {
					int stars1 = repo1.get("stargazers_count").asInt();
					int stars2 = repo2.get("stargazers_count").asInt();
					return Integer.compare(stars2, stars1); // Desc order
				});

				// new Json object with the sorted "items" array
				ObjectNode sortedRootNode = objectMapper.createObjectNode();
				sortedRootNode.put("total_count", rootNode.get("total_count").asInt());
				sortedRootNode.put("incomplete_results", rootNode.get("incomplete_results").asBoolean());
				sortedRootNode.set("items", objectMapper.valueToTree(repositoriesList));

				// Return the sorted JSON response
				String sortedApiResponse = objectMapper.writeValueAsString(sortedRootNode);
				return new ResponseEntity<>(sortedApiResponse, HttpStatus.OK);

			} catch (Exception e){
				// Handling exceptions, log errors, and return response if needed
				return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}


	}
