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
    const url = "/articles/" + this.articleIdValue + "/comments";

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ comment: { content: this.inputTarget.value } }),
      headers: {
        "Content-Type": "application/json",
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
      ${data.content}
      <button data-action="click->comments#delete" data-id="${data.id}">🗑️</button>
      `;
      commentsList.appendChild(newComment);
      alert("Comment added!");
      // Clear the form
      this.inputTarget.value = '';
      // Update the comments count
      this.countTarget.textContent = parseInt(this.countTarget.textContent) + 1;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  delete(event) {
    const result = confirm("Want to delete?");
    if (result) {
      //Logic to delete the item
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
          if (commentElement) {
            commentElement.classList.add("deleted-comment")
            setTimeout(() => commentElement.remove(), 300)
            this.countTarget.textContent = parseInt(this.countTarget.textContent) - 1;
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
}
