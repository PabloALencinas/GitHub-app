package com.pabloagustin.githubappbackend.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin
public class GithubusersController {

	private final String GITHUB_API_BASE_URL_USERS = "https://api.github.com/users";
	private final RestTemplate restTemplate = new RestTemplate();

	@GetMapping("/api/users/{username}")
	public ResponseEntity<String> searchUser(@PathVariable String username) {
		try {
			// URL for the API Request
			String apiURL = GITHUB_API_BASE_URL_USERS + "/" + username;

			// Making the Http GET request to the GitHub API
			String apiResponse = restTemplate.getForObject(apiURL, String.class);

			// Return the response
			return ResponseEntity.ok(apiResponse);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred: " + e.getMessage());
		}
	}

}
