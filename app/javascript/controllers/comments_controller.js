import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="comments"
export default class extends Controller {
  static targets = [ "list", "input", "count" ]
  static values = {
    articleId: Number
  }
  connect() {
  }

  create(event) {

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = "/articles/" + this.articleIdValue + "/comments";

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      }
    })
    .then(response => response.json())
    .then(data => {
      // Append the new comment to the comments list

      const commentsList = this.listTarget;
      const newComment = document.createElement('li');
      newComment.innerHTML = `
      <p>${data.content}
      <button data-action="click->comments#delete" data-id="${data.id}">🗑️</button></p>
      `;
      commentsList.appendChild(newComment);
      // Clear the form
      this.inputTarget.value = '';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  delete(event) {
    event.preventDefault();
    const url = "/articles/" + this.articleIdValue + "/comments/" + event.currentTarget.dataset.id;
    const commentElement = event.currentTarget.parentElement;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      }
    })
    .then(response => {
      if (response.ok) {
        // Remove the comment element from the
        console.log(commentElement);

        if (commentElement) {
          commentElement.remove();
        }
      } else {
        console.error('Failed to delete comment');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
