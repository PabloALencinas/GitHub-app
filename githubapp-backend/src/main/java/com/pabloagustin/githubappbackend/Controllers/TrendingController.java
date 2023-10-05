package com.pabloagustin.githubappbackend.Controllers;


import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/trending")
@CrossOrigin
public class TrendingController {

	private final String GITHUB_API_BASE_URL = "https://api.github.com/search/repositories";
	private final RestTemplate restTemplate = new RestTemplate();
	@Value("${github.pat}")
	private String githubAccessToken;

	@GetMapping("/repositories")
	public ResponseEntity<String> getTrendingRepositories(
			@RequestParam(name = "language") String language
	){

		try {
			// URL for the GitHub API Request
			String apiURL = GITHUB_API_BASE_URL + "?q=language:" + language;

			// Sorting by stars
			apiURL += "&sort=stars&order=desc&page=1&per_page=10";

			// Making the HTTP GET request to the GitHub API with authentication
			String apiResponse = restTemplate.getForObject(apiURL, String.class);

			// Return the API response
			return new ResponseEntity<>(apiResponse, HttpStatus.OK);
		} catch (Exception e){
			return new ResponseEntity<>("An error ocurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}


	}

}
